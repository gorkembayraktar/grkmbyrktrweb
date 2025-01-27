import { adminClient } from './supabase/server';
import type { GeneralSettings } from '../types';

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
    return obj;
}; 