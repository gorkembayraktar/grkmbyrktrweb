'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { FaArrowUp, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import type { ScrollToTopSettings } from '@/app/types';

// Varsayılan renkler
const defaultColors = [
    { bg: '#007AFF', text: '#FFFFFF', name: 'Mavi' },
    { bg: '#34C759', text: '#FFFFFF', name: 'Yeşil' },
    { bg: '#FF9500', text: '#FFFFFF', name: 'Turuncu' },
    { bg: '#FF3B30', text: '#FFFFFF', name: 'Kırmızı' },
    { bg: '#5856D6', text: '#FFFFFF', name: 'Mor' },
    { bg: '#000000', text: '#FFFFFF', name: 'Siyah' },
    { bg: '#8E8E93', text: '#FFFFFF', name: 'Gri' },
    { bg: '#222222', text: '#007AFF', name: 'Koyu Tema' }
];

export default function ScrollToTopSettings() {
    const [settings, setSettings] = useState<ScrollToTopSettings>({
        is_active: true,
        position: 'bottom-right',
        size: 'medium',
        margin_x: 18,
        margin_y: 18,
        show_mobile: true,
        bg_color: '#007AFF',
        text_color: '#FFFFFF',
        show_after_scroll: 300,
        scroll_behavior: 'auto'
    });

    const [isAppearanceOpen, setIsAppearanceOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('settings')
                .select('value')
                .eq('key', 'module_scroll_to_top')
                .maybeSingle();

            if (error) throw error;

            if (data?.value) {
                setSettings(JSON.parse(data.value));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('settings')
                .upsert({
                    key: 'module_scroll_to_top',
                    value: JSON.stringify(settings)
                }, {
                    onConflict: 'key'
                });

            if (error) throw error;
            toast.success('Ayarlar başarıyla kaydedildi');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Ayarlar kaydedilirken bir hata oluştu');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6">Yükleniyor...</div>;
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                            <FaArrowUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold">Yukarı Çık Butonu Ayarları</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Yukarı çık butonu için gerekli ayarları yapılandırın</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {settings.is_active ? 'Aktif' : 'Pasif'}
                            </span>
                            <button
                                onClick={() => setSettings(prev => ({ ...prev, is_active: !prev.is_active }))}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                                    ${settings.is_active ? 'bg-blue-500' : 'bg-gray-200'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm
                                    ${settings.is_active ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>
                        <button
                            onClick={saveSettings}
                            disabled={isSaving}
                            className={`py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2
                                ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Kaydediliyor...
                                </>
                            ) : (
                                <>
                                    <FaArrowUp className="h-4 w-4" />
                                    Kaydet
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sol Panel - Görünüm Ayarları */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Görünüm Ayarları Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <button
                            onClick={() => setIsAppearanceOpen(!isAppearanceOpen)}
                            className="w-full p-6 flex items-center justify-between text-left"
                        >
                            <div className="flex items-center gap-2">
                                <span className="bg-purple-100 dark:bg-purple-900 p-1.5 rounded">
                                    <FaArrowUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </span>
                                <h2 className="text-lg font-medium">Görünüm Ayarları</h2>
                            </div>
                            <FaChevronDown className={`transform transition-transform ${isAppearanceOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isAppearanceOpen && (
                            <div className="p-6 pt-0 border-t border-gray-200 dark:border-gray-700">
                                <div className="space-y-8">
                                    {/* Konum Seçici */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Konum
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['bottom-left', 'bottom-right'].map((pos) => (
                                                <button
                                                    key={pos}
                                                    onClick={() => setSettings(prev => ({ ...prev, position: pos as any }))}
                                                    className={`py-3 px-4 rounded-lg border-2 transition-all ${settings.position === pos
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                        }`}
                                                >
                                                    {pos.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Boyut Seçici */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Boyut
                                        </label>
                                        <div className="flex gap-3">
                                            {['small', 'medium', 'large'].map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSettings(prev => ({ ...prev, size: size as any }))}
                                                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${settings.size === size
                                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                        }`}
                                                >
                                                    {size.charAt(0).toUpperCase() + size.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Kenar Boşlukları */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Kenar Boşlukları
                                        </label>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <label className="text-sm text-gray-600 dark:text-gray-400">Yatay (X)</label>
                                                    <span className="text-sm font-medium">{settings.margin_x}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={settings.margin_x}
                                                    onChange={(e) => setSettings(prev => ({ ...prev, margin_x: Number(e.target.value) }))}
                                                    className="w-full accent-blue-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <label className="text-sm text-gray-600 dark:text-gray-400">Dikey (Y)</label>
                                                    <span className="text-sm font-medium">{settings.margin_y}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={settings.margin_y}
                                                    onChange={(e) => setSettings(prev => ({ ...prev, margin_y: Number(e.target.value) }))}
                                                    className="w-full accent-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Scroll Mesafesi */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Görünme Mesafesi
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setSettings(prev => ({
                                                        ...prev,
                                                        scroll_behavior: 'auto'
                                                    }))}
                                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${settings.scroll_behavior === 'auto'
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                        }`}
                                                >
                                                    Otomatik
                                                </button>
                                                <button
                                                    onClick={() => setSettings(prev => ({
                                                        ...prev,
                                                        scroll_behavior: 'manual'
                                                    }))}
                                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${settings.scroll_behavior === 'manual'
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                        }`}
                                                >
                                                    Manuel
                                                </button>
                                            </div>
                                        </div>

                                        {settings.scroll_behavior === 'manual' && (
                                            <>
                                                <div className="flex justify-between">
                                                    <label className="text-sm text-gray-600 dark:text-gray-400">Piksel Cinsinden</label>
                                                    <span className="text-sm font-medium">{settings.show_after_scroll}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1000"
                                                    step="50"
                                                    value={settings.show_after_scroll}
                                                    onChange={(e) => setSettings(prev => ({
                                                        ...prev,
                                                        show_after_scroll: Number(e.target.value)
                                                    }))}
                                                    className="w-full accent-blue-500"
                                                />
                                                <p className="text-sm text-gray-500">
                                                    Butonun görünmesi için gerekli scroll mesafesi
                                                </p>
                                            </>
                                        )}
                                    </div>

                                    {/* Mobil Görünüm */}
                                    <div className="flex items-center justify-between py-2">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Mobil Görünüm
                                            </label>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Mobil cihazlarda butonu göster
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSettings(prev => ({ ...prev, show_mobile: !prev.show_mobile }))}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                                                ${settings.show_mobile ? 'bg-blue-500' : 'bg-gray-200'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm
                                                ${settings.show_mobile ? 'translate-x-6' : 'translate-x-1'}`}
                                            />
                                        </button>
                                    </div>

                                    {/* Renk Ayarları */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Renk Ayarları
                                        </label>

                                        {/* Varsayılan Renkler */}
                                        <div className="mb-6">
                                            <div className="flex gap-2 flex-wrap">
                                                {defaultColors.map((color, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSettings(prev => ({
                                                            ...prev,
                                                            bg_color: color.bg,
                                                            text_color: color.text
                                                        }))}
                                                        className="group relative p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500"
                                                        title={color.name}
                                                    >
                                                        <div
                                                            className="w-8 h-8 rounded-full"
                                                            style={{ backgroundColor: color.bg }}
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="bg-black/75 text-white text-xs py-1 px-2 rounded">
                                                                {color.name}
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Özel Renk Seçiciler */}
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-600 dark:text-gray-400">
                                                    Arkaplan Rengi
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="color"
                                                        value={settings.bg_color}
                                                        onChange={(e) => setSettings(prev => ({ ...prev, bg_color: e.target.value }))}
                                                        className="h-10 w-20 rounded cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={settings.bg_color}
                                                        onChange={(e) => setSettings(prev => ({ ...prev, bg_color: e.target.value }))}
                                                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                                                        placeholder="#007AFF"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-600 dark:text-gray-400">
                                                    İkon Rengi
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="color"
                                                        value={settings.text_color}
                                                        onChange={(e) => setSettings(prev => ({ ...prev, text_color: e.target.value }))}
                                                        className="h-10 w-20 rounded cursor-pointer"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={settings.text_color}
                                                        onChange={(e) => setSettings(prev => ({ ...prev, text_color: e.target.value }))}
                                                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                                                        placeholder="#FFFFFF"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sağ Panel - Önizleme */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        {/* Önizleme Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-medium">Canlı Önizleme</h3>
                            </div>
                            <div className="p-4">
                                <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg aspect-[9/16] overflow-hidden">
                                    {/* Örnek Sayfa İçeriği */}
                                    <div className="absolute inset-0 p-4">
                                        <div className="w-full h-4 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                                        <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                                        <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                                    </div>

                                    {/* Yukarı Çık Butonu */}
                                    <div
                                        className="absolute"
                                        style={{
                                            bottom: `${settings.margin_y}px`,
                                            [settings.position.includes('right') ? 'right' : 'left']: `${settings.margin_x}px`,
                                        }}
                                    >
                                        <button
                                            className={`rounded-full flex items-center justify-center shadow-lg transition-colors
                                                ${settings.size === 'small' ? 'w-10 h-10' : settings.size === 'medium' ? 'w-12 h-12' : 'w-14 h-14'}`}
                                            style={{
                                                backgroundColor: settings.bg_color,
                                                color: settings.text_color
                                            }}
                                        >
                                            <FaArrowUp size={settings.size === 'small' ? 16 : settings.size === 'medium' ? 20 : 24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 