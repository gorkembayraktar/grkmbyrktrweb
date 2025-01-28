import React from 'react'
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { PostFormData } from '../types'
import { analyzeSEO as analyzeSEOUtil } from '../utils/seo'

interface SEOAnalysisProps {
    content: string;
    formData: PostFormData;
}

interface AnalysisItemProps {
    title: string;
    message: string;
    isOptimal: boolean;
}

export function SEOAnalysis({ content, formData }: SEOAnalysisProps) {
    const analysis = analyzeSEOUtil(content, formData);

    return (
        <div className="space-y-4">
            {/* SEO Skoru */}
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <span className="font-medium">SEO Skoru</span>
                <div className={`px-3 py-1 rounded-full text-sm font-medium
                    ${analysis.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        analysis.score >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                    {analysis.score}/100
                </div>
            </div>

            {/* Detaylı Analiz */}
            <div className="space-y-3">
                <AnalysisItem
                    title="Başlık"
                    message={`${analysis.title.length} karakter - ${analysis.title.message}`}
                    isOptimal={analysis.title.isOptimal}
                />
                <AnalysisItem
                    title="Açıklama"
                    message={`${analysis.description.length} karakter - ${analysis.description.message}`}
                    isOptimal={analysis.description.isOptimal}
                />
                <AnalysisItem
                    title="İçerik"
                    message={`${analysis.content.wordCount} kelime - ${analysis.content.message}`}
                    isOptimal={analysis.content.isOptimal}
                />
                <AnalysisItem
                    title="Başlık Etiketleri"
                    message={`H1: ${analysis.headings.h1}, H2: ${analysis.headings.h2}, H3: ${analysis.headings.h3} - ${analysis.headings.message}`}
                    isOptimal={analysis.headings.isOptimal}
                />

                {/* Anahtar Kelime Analizi */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Anahtar Kelimeler</span>
                        {analysis.keywords.isOptimal ? (
                            <FaCheckCircle className="text-green-500" size={14} />
                        ) : (
                            <FaExclamationTriangle className="text-yellow-500" size={14} />
                        )}
                    </div>
                    {analysis.keywords.density.map((kw) => (
                        <div key={kw.keyword} className="flex items-center justify-between text-sm">
                            <span>{kw.keyword}</span>
                            <span className={kw.isOptimal ? 'text-green-500' : 'text-yellow-500'}>
                                {kw.count} kez (%{kw.percentage})
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AnalysisItem({ title, message, isOptimal }: AnalysisItemProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="font-medium">{title}</span>
                {isOptimal ? (
                    <FaCheckCircle className="text-green-500" size={14} />
                ) : (
                    <FaExclamationTriangle className="text-yellow-500" size={14} />
                )}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{message}</span>
        </div>
    );
}

// SEO analiz fonksiyonları
function analyzeSEO(content: string, formData: PostFormData) {
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

function analyzeTitle(title: string) {
    return {
        length: title.length,
        isOptimal: title.length >= 30 && title.length <= 60,
        message: title.length < 30 ? 'Title çok kısa' :
            title.length > 60 ? 'Title çok uzun' :
                'Title uzunluğu ideal'
    };
}

function analyzeDescription(description: string) {
    return {
        length: description.length,
        isOptimal: description.length >= 120 && description.length <= 160,
        message: description.length < 120 ? 'Description çok kısa' :
            description.length > 160 ? 'Description çok uzun' :
                'Description uzunluğu ideal'
    };
}

function analyzeContent(content: string) {
    const wordCount = content.split(/\s+/).length;
    return {
        wordCount,
        isOptimal: wordCount >= 300,
        message: wordCount < 300 ? 'İçerik çok kısa (min. 300 kelime önerilir)' :
            'İçerik uzunluğu yeterli'
    };
}

function analyzeKeywords(content: string, keywords: string) {
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

function analyzeHeadings(content: string) {
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

function calculateScore(results: any) {
    let score = 0;
    if (results.title.isOptimal) score += 20;
    if (results.description.isOptimal) score += 20;
    if (results.content.isOptimal) score += 20;
    if (results.keywords.isOptimal) score += 20;
    if (results.headings.isOptimal) score += 20;
    return score;
}
