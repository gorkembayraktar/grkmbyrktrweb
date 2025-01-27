export interface MenuItem {
    title: string;
    href: string;
}

export interface Service {
    title: string;
    description: string;
    icon: string;
}

export interface Settings {
    [key: string]: any;
}

export interface GeneralSettings {
    title: string
    description: string
    keywords: string
    contact_email: string
    contact_phone: string
    contact_address: string
    footer_copyright: string
}

export interface WhatsAppSettings {
    phone: string;
    default_message: string;
    is_active: boolean;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    size: 'small' | 'medium' | 'large';
    margin_x: number;
    margin_y: number;
    show_mobile: boolean;
    bg_color: string;
    text_color: string;
}


export interface Project {
    id: string
    title: string
    description: string
    image_url: string
    project_url: string
    sort_order: number
    created_at: string
    updated_at: string
}