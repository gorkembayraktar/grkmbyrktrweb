import { PostFormData } from '../types'

interface SEOAnalysisResult {
    title: {
        length: number;
        isOptimal: boolean;
        message: string;
    };
    description: {
        length: number;
        isOptimal: boolean;
        message: string;
    };
    content: {
        wordCount: number;
        isOptimal: boolean;
        message: string;
    };
    keywords: {
        density: Array<{
            keyword: string;
            count: number;
            percentage: string;
            isOptimal: boolean;
        }>;
        isOptimal: boolean;
        message: string;
    };
    headings: {
        h1: number;
        h2: number;
        h3: number;
        isOptimal: boolean;
        message: string;
    };
    score: number;
}

export function analyzeSEO(content: string, formData: PostFormData): SEOAnalysisResult {
    const results = {
        title: analyzeTitle(formData.meta_title || formData.title),
        description: analyzeDescription(formData.meta_description),
        content: analyzeContent(content),
        keywords: analyzeKeywords(content, formData.meta_keywords),
        headings: analyzeHeadings(content),
        score: 0
    };

    results.score = calculateScore(results);
    return results;
}

export function analyzeTitle(title: string) {
    return {
        length: title.length,
        isOptimal: title.length >= 30 && title.length <= 60,
        message: title.length < 30 ? 'Title çok kısa' :
            title.length > 60 ? 'Title çok uzun' :
                'Title uzunluğu ideal'
    };
}

export function analyzeDescription(description: string) {
    return {
        length: description.length,
        isOptimal: description.length >= 120 && description.length <= 160,
        message: description.length < 120 ? 'Description çok kısa' :
            description.length > 160 ? 'Description çok uzun' :
                'Description uzunluğu ideal'
    };
}

export function analyzeContent(content: string) {
    const wordCount = content.split(/\s+/).length;
    return {
        wordCount,
        isOptimal: wordCount >= 300,
        message: wordCount < 300 ? 'İçerik çok kısa (min. 300 kelime önerilir)' :
            'İçerik uzunluğu yeterli'
    };
}

export function analyzeKeywords(content: string, keywords: string) {
    if (!keywords) return {
        message: 'Anahtar kelimeler belirlenmemiş',
        isOptimal: false,
        density: []
    };

    const keywordList = keywords.split(',').map(k => k.trim().toLowerCase());
    const contentLower = content.toLowerCase();
    const wordCount = content.split(/\s+/).length;

    const density = keywordList.map(keyword => {
        const count = (contentLower.match(new RegExp(keyword, 'g')) || []).length;
        const percentage = (count / wordCount) * 100;
        return {
            keyword,
            count,
            percentage: percentage.toFixed(1),
            isOptimal: percentage >= 0.5 && percentage <= 2.5
        };
    });

    return {
        density,
        isOptimal: density.some(d => d.isOptimal),
        message: density.some(d => d.isOptimal) ?
            'Anahtar kelime yoğunluğu uygun' :
            'Anahtar kelime kullanımı yetersiz'
    };
}

export function analyzeHeadings(content: string) {
    const h1Count = (content.match(/<h1/g) || []).length;
    const h2Count = (content.match(/<h2/g) || []).length;
    const h3Count = (content.match(/<h3/g) || []).length;

    return {
        h1: h1Count,
        h2: h2Count,
        h3: h3Count,
        isOptimal: h1Count === 1 && h2Count >= 2 && h3Count >= 1,
        message: h1Count !== 1 ? 'Sayfada bir adet H1 etiketi olmalı' :
            h2Count < 2 ? 'En az 2 adet H2 etiketi önerilir' :
                h3Count < 1 ? 'En az 1 adet H3 etiketi önerilir' :
                    'Başlık hiyerarşisi uygun'
    };
}

export function calculateScore(results: SEOAnalysisResult) {
    let score = 0;
    if (results.title.isOptimal) score += 20;
    if (results.description.isOptimal) score += 20;
    if (results.content.isOptimal) score += 20;
    if (results.keywords.isOptimal) score += 20;
    if (results.headings.isOptimal) score += 20;
    return score;
}

// ... diğer analiz fonksiyonları ... 