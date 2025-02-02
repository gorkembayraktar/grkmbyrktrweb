'use client'
import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationProps {
    total: number
    perPage: number
    currentPage: number
}

export default function Pagination({ total, perPage, currentPage }: PaginationProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const totalPages = Math.ceil(total / perPage)
    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        router.push(`/blog?${params.toString()}`)
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex justify-center gap-2 mt-8">
            {currentPage > 1 && (
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 rounded-lg bg-dark-darker hover:bg-dark-light transition-colors"
                >
                    Önceki
                </button>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${page === currentPage
                        ? 'bg-primary text-black'
                        : 'bg-dark-darker hover:bg-dark-light'
                        }`}
                >
                    {page}
                </button>
            ))}

            {currentPage < totalPages && (
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 rounded-lg bg-dark-darker hover:bg-dark-light transition-colors"
                >
                    Sonraki
                </button>
            )}
        </div>
    )
} 