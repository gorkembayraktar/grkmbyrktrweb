export const formatPhoneNumber = (phone: string) => {
    // Sadece rakamları al
    const numbers = phone.replace(/\D/g, '');

    // Eğer numara 10 haneden azsa veya boşsa orijinal değeri döndür
    if (!numbers || numbers.length < 10) return phone;

    // Türkiye formatında telefon numarası oluştur
    return `+${numbers.slice(0, 2)} (${numbers.slice(2, 5)}) ${numbers.slice(5, 8)} ${numbers.slice(8, 10)} ${numbers.slice(10, 12)}`;
}; 