import { adminClient } from './supabase/server';
import type { GeneralSettings, ScrollToTopSettings, WhatsAppSettings } from '../types';

let settingsObject: GeneralSettings | null = null;

export const ArrayToObjectSettings = (array: any): GeneralSettings => {
    return array.reduce((acc: any, item: any) => {
        acc[item.key] = item.value;
        return acc;
    }, {}) as GeneralSettings;
};

export const getSettings = async (): Promise<GeneralSettings> => {
    if (settingsObject) return settingsObject;

    const supabase = await adminClient();
    const { data: settings, error: settingsError } = await supabase
        .from('settings')
        .select('*');

    if (settingsError) {
        console.error('Error fetching settings:', settingsError);
    }

    const obj = ArrayToObjectSettings(settings || []);
    settingsObject = obj;

    // WhatsApp ayarlarını parse et
    let whatsapp = settingsObject?.module_whatsapp;
    if (whatsapp) {
        try {
            settingsObject.whatsapp = JSON.parse(whatsapp) as WhatsAppSettings;
        } catch (error) {
            console.error('Error parsing WhatsApp settings:', error);
        }
    }

    let scrollSettings = settingsObject?.module_scroll_to_top;
    if (scrollSettings) {
        try {
            settingsObject.scrollSettings = JSON.parse(scrollSettings) as ScrollToTopSettings;
        } catch (error) {
            console.error('Error parsing ScrollToTop settings:', error);
        }
    }

    return obj;
}; 