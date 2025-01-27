
import { createClient } from '@/app/utils/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FaEye, FaGlobe, FaMobile, FaDesktop } from 'react-icons/fa';

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

    // Fetch view statistics grouped by page_path
    const { data: viewStats, error } = await supabase
        .from('views')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching view stats:', error);
        return <div>İstatistikler yüklenirken bir hata oluştu.</div>;
    }

    // Group and process the data
    const stats = (viewStats as ViewRecord[]).reduce((acc: { [key: string]: ViewStats }, view) => {
        if (!acc[view.page_path]) {
            acc[view.page_path] = {
                page_path: view.page_path,
                total_views: 0,
                unique_views: 0,
                mobile_views: 0,
                desktop_views: 0,
                last_view_date: view.created_at,
                countries: []
            };
        }

        const stat = acc[view.page_path];
        stat.total_views += view.view_count;
        stat.unique_views += view.is_unique ? 1 : 0;
        stat.mobile_views += view.is_mobile ? 1 : 0;
        stat.desktop_views += !view.is_mobile ? 1 : 0;

        // Update countries stats
        if (view.country) {
            const countryIndex = stat.countries.findIndex(c => c.country === view.country);
            if (countryIndex >= 0) {
                stat.countries[countryIndex].views += 1;
            } else {
                stat.countries.push({ country: view.country, views: 1 });
            }
        }

        return acc;
    }, {});

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Sayfa Görüntülenme İstatistikleri</h1>

            <div className="grid gap-6">
                {Object.values(stats).map((stat) => (
                    <div key={stat.page_path} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4 truncate">{stat.page_path}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <FaEye className="text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Toplam Görüntülenme</div>
                                    <div className="font-semibold">{stat.total_views}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <FaGlobe className="text-green-500" />
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Tekil Görüntülenme</div>
                                    <div className="font-semibold">{stat.unique_views}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <FaMobile className="text-purple-500" />
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Mobil</div>
                                    <div className="font-semibold">{stat.mobile_views}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <FaDesktop className="text-orange-500" />
                                <div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Masaüstü</div>
                                    <div className="font-semibold">{stat.desktop_views}</div>
                                </div>
                            </div>
                        </div>

                        {stat.countries.length > 0 && (
                            <div className="mt-4">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Ülkelere Göre Görüntülenme</div>
                                <div className="flex flex-wrap gap-2">
                                    {stat.countries
                                        .sort((a, b) => b.views - a.views)
                                        .slice(0, 5)
                                        .map((country) => (
                                            <span key={country.country}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {country.country}: {country.views}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Son görüntülenme: {formatDistanceToNow(new Date(stat.last_view_date), { addSuffix: true, locale: tr })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 