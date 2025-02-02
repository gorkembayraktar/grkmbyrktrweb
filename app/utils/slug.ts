export function generateSlug(text: string): string {
    const charMap: { [key: string]: string } = {
        'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c',
        'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'İ': 'i', 'Ö': 'o', 'Ç': 'c',
        'â': 'a', 'ê': 'e', 'î': 'i', 'û': 'u',
        'Â': 'a', 'Ê': 'e', 'Î': 'i', 'Û': 'u'
    };

    return text
        // Türkçe karakterleri dönüştür (küçük harfe çevirmeden önce)
        .replace(/[ğüşıöçâêîûĞÜŞİÖÇÂÊÎÛ]/g, letter => charMap[letter] || letter)
        // Sonra küçük harfe çevir
        .toLowerCase()
        // Alfanumerik olmayan karakterleri tire ile değiştir
        .replace(/[^a-z0-9]+/g, '-')
        // Birden fazla tireyi tek tireye indir
        .replace(/-+/g, '-')
        // Baştaki ve sondaki tireleri temizle
        .replace(/^-+|-+$/g, '');
} 