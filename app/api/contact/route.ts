import { adminClient } from '@/app/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, message } = body;

        const supabase = await adminClient();

        const { error } = await supabase
            .from('contacts')
            .insert([
                {
                    fullname: name,
                    email,
                    phone,
                    message,
                    is_read: false
                }
            ]);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving contact:', error);
        return NextResponse.json(
            { error: 'İletişim formu gönderilirken bir hata oluştu' },
            { status: 500 }
        );
    }
} 