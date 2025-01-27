import { createClient } from '@/app/utils/supabase/server';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FaEye, FaGlobe, FaMobile, FaDesktop, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

interface ViewRecord {
    page_path: string;
    view_count: number;
    is_unique: boolean;
    is_mobile: boolean;
    country: string;
    created_at: string;
}

interface ViewStats {
    page_path: string;
    total_views: number;
    unique_views: number;
    mobile_views: number;
    desktop_views: number;
    last_view_date: string;
    countries: { country: string; views: number }[];
}

export default async function ViewStatsPage() {
    const supabase = await createClient();

    // First query
    const { data: stats, error } = await supabase
        .from('page_views')
        .select('*');

    if (error || !stats) {
        console.error('Error fetching view stats:', error);
        return <div className="p-6">İstatistikler yüklenirken bir hata oluştu.</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Sayfa Görüntülenme İstatistikleri</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Sayfa Yolu
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <FaEye className="text-blue-500" />
                                    Toplam
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <FaMobile className="text-purple-500" />
                                    Mobil
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <FaDesktop className="text-orange-500" />
                                    Masaüstü
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Son Görüntülenme
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                İşlemler
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {stats.map((stat) => (
                            <tr key={stat.page_path} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {stat.page_path}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {stat.total_views}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {stat.mobile_views}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {stat.desktop_views}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    {formatDistanceToNow(new Date(stat.last_view_date), { addSuffix: true, locale: tr })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    <Link
                                        href={`/dashboard/view-stats/${encodeURIComponent(stat.page_path)}`}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors dark:bg-blue-900 dark:text-blue-200"
                                    >
                                        <FaInfoCircle />
                                        Detay
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 