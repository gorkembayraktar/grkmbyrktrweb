import { createClient } from '@/app/utils/supabase/server';
import { formatDistanceToNow, format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaMobile, FaDesktop, FaGlobe, FaClock, FaFirefox, FaLanguage, FaMapMarkerAlt, FaLink, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import HiddenIp from './components/HiddenIp';

interface ViewRecord {
    id: string;
    page_path: string;
    view_count: number;
    ip_address: string;
    user_agent: string;
    device_type: string;
    browser: string;
    os: string;
    country: string;
    city: string;
    language: string;
    referrer: string;
    session_duration: number;
    is_unique: boolean;
    is_mobile: boolean;
    created_at: string;
}

export default async function ViewStatsDetail({ params, searchParams }: {
    params: Promise<{ path?: string }>,
    searchParams: Promise<{ page?: string }>
}) {
    const prm = await searchParams;
    const { path: sPath } = await params;

    if (!sPath) {
        return notFound();
    }

    const path = decodeURIComponent(sPath);
    const supabase = await createClient();
    const page = Number(prm.page) || 1;
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // Toplam kayıt sayısını al
    const { count } = await supabase
        .from('views')
        .select('*', { count: 'exact', head: true })
        .eq('page_path', path);

    // Sayfalı veriyi al
    const { data: viewStats, error } = await supabase
        .from('views')
        .select('*')
        .eq('page_path', path)
        .order('created_at', { ascending: false })
        .range(start, end);

    if (error || !viewStats) {
        return notFound();
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    // İstatistikleri hesapla
    const totalViews = viewStats.length;
    const uniqueViews = viewStats.filter(v => v.is_unique).length;
    const mobileViews = viewStats.filter(v => v.is_mobile).length;
    const desktopViews = viewStats.filter(v => !v.is_mobile).length;

    // Ülke istatistikleri
    const countryStats = viewStats.reduce((acc, view) => {
        if (view.country) {
            acc[view.country] = (acc[view.country] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/dashboard/view-stats"
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                >
                    <FaArrowLeft /> Geri
                </Link>
                <h1 className="text-2xl font-bold">"{path}" Sayfa Detayları</h1>
            </div>

            {/* Özet İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Toplam Görüntülenme</div>
                    <div className="text-2xl font-bold">{totalViews}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Tekil Görüntülenme</div>
                    <div className="text-2xl font-bold">{uniqueViews}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Mobil</div>
                    <div className="text-2xl font-bold">{mobileViews}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Masaüstü</div>
                    <div className="text-2xl font-bold">{desktopViews}</div>
                </div>
            </div>

            {/* Ülke İstatistikleri */}
            {Object.keys(countryStats).length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FaGlobe /> Ülkelere Göre Görüntülenme
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(countryStats)
                            .sort(([, a]: [any, any], [, b]: [any, any]) => b - a)
                            .map(([country, count]: [any, any]) => (
                                <div key={country} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                                    <div className="font-medium">{country}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{count} görüntülenme</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}

            {/* Detaylı Görüntülenme Listesi */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Görüntülenme Geçmişi</h2>
                    <div className="text-sm text-gray-500">
                        Toplam {count} kayıt
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tarih</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">IP</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cihaz</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">İşletim Sistemi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tarayıcı</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Konum</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dil</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Referrer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Süre</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {viewStats.map((view: ViewRecord) => (
                                <tr key={view.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {format(new Date(view.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        <HiddenIp ip={view.ip_address} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            {view.is_mobile ?
                                                <FaMobile className="text-purple-500" /> :
                                                <FaDesktop className="text-blue-500" />
                                            }
                                            {view.device_type || (view.is_mobile ? 'Mobil' : 'Masaüstü')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {view.os || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {view.browser || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {[view.city, view.country].filter(Boolean).join(', ') || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {view.language || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        <div className="truncate max-w-xs">
                                            {view.referrer || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {view.session_duration ? `${Math.round(view.session_duration / 1000)}s` : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Sayfalama */}
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <Link
                            href={`/dashboard/view-stats/${encodeURIComponent(path)}?page=${page - 1}`}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
                                ${page === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-blue-600 hover:text-blue-800'}`}
                            aria-disabled={page === 1}
                        >
                            Önceki
                        </Link>
                        <Link
                            href={`/dashboard/view-stats/${encodeURIComponent(path)}?page=${page + 1}`}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                ${page >= totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-blue-600 hover:text-blue-800'}`}
                            aria-disabled={page >= totalPages}
                        >
                            Sonraki
                        </Link>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Gösterilen <span className="font-medium">{start + 1}</span> ile{' '}
                                <span className="font-medium">{Math.min(end + 1, count || 0)}</span> arası,{' '}
                                toplam <span className="font-medium">{count}</span> kayıt
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <Link
                                    href={`/dashboard/view-stats/${encodeURIComponent(path)}?page=${page - 1}`}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium
                                        ${page === 1
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                    aria-disabled={page === 1}
                                >
                                    <FaChevronLeft className="h-5 w-5" />
                                </Link>
                                {[...Array(totalPages)].map((_, i) => (
                                    <Link
                                        key={i + 1}
                                        href={`/dashboard/view-stats/${encodeURIComponent(path)}?page=${i + 1}`}
                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium
                                            ${page === i + 1
                                                ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200'
                                                : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                    >
                                        {i + 1}
                                    </Link>
                                ))}
                                <Link
                                    href={`/dashboard/view-stats/${encodeURIComponent(path)}?page=${page + 1}`}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium
                                        ${page >= totalPages
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                    aria-disabled={page >= totalPages}
                                >
                                    <FaChevronRight className="h-5 w-5" />
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 