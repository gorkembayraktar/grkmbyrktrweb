'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { FaPlus, FaLink, FaImage, FaClock, FaEdit, FaTrash } from 'react-icons/fa'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import ProjectModal from '@/app/components/modals/ProjectModal'
import DeleteConfirmModal from '@/app/components/modals/DeleteConfirmModal'

interface Project {
    id: string
    title: string
    description: string
    image_url: string
    project_url: string
    created_at: string
    updated_at: string
}

interface ProjectFormData {
    title: string
    description: string
    image_url: string
    project_url: string
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [formData, setFormData] = useState<ProjectFormData>({
        title: '',
        description: '',
        image_url: '',
        project_url: ''
    })

    const supabase = createClient()

    const loadProjects = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setProjects(data || [])
        } catch (error) {
            console.error('Error loading projects:', error)
            toast.error('Projeler yüklenirken bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProjects()
    }, [])

    const handleEdit = (project: Project) => {
        setSelectedProject(project)
        setFormData({
            title: project.title,
            description: project.description,
            image_url: project.image_url || '',
            project_url: project.project_url || ''
        })
        setShowModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (selectedProject) {
                // Güncelleme işlemi
                const { error } = await supabase
                    .from('projects')
                    .update({
                        title: formData.title,
                        description: formData.description,
                        image_url: formData.image_url,
                        project_url: formData.project_url
                    })
                    .eq('id', selectedProject.id)

                if (error) throw error
                toast.success('Proje başarıyla güncellendi')
            } else {
                // Yeni proje ekleme
                const { error } = await supabase
                    .from('projects')
                    .insert([formData])

                if (error) throw error
                toast.success('Proje başarıyla eklendi')
            }

            // Modal'ı kapat ve formu sıfırla
            setShowModal(false)
            setSelectedProject(null)
            setFormData({
                title: '',
                description: '',
                image_url: '',
                project_url: ''
            })

            // Projeleri yeniden yükle
            await loadProjects()
        } catch (error) {
            console.error('Error saving project:', error)
            toast.error(selectedProject ? 'Proje güncellenirken bir hata oluştu' : 'Proje eklenirken bir hata oluştu')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedProject(null)
        setFormData({
            title: '',
            description: '',
            image_url: '',
            project_url: ''
        })
    }

    const handleDelete = (project: Project) => {
        setSelectedProject(project)
        setShowDeleteModal(true)
    }

    const handleDeleteConfirm = async () => {
        if (!selectedProject) return

        setIsDeleting(true)
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', selectedProject.id)

            if (error) {
                console.error('Delete error:', error)
                throw error
            }

            toast.success('Proje başarıyla silindi')
            setShowDeleteModal(false)
            setSelectedProject(null)
            await loadProjects()
        } catch (error: any) {
            console.error('Error deleting project:', error)
            toast.error(error?.message || 'Proje silinirken bir hata oluştu')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false)
        setSelectedProject(null)
    }

    return (
        <div className="py-6">
            <div className="px-4 sm:px-6 md:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Projeler</h1>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            Tüm projelerinizin listesi
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                            Yeni Proje
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex flex-col">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 dark:ring-white/10 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                                                Proje
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                Açıklama
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                URL
                                            </th>
                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                Tarih
                                            </th>
                                            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Düzenle</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                        {projects.map((project) => (
                                            <tr key={project.id}>
                                                <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                    <div className="flex items-center">
                                                        {project.image_url && (
                                                            <div className="h-10 w-10 flex-shrink-0">
                                                                <img
                                                                    src={project.image_url}
                                                                    alt=""
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="ml-4">
                                                            <div className="font-medium text-gray-900 dark:text-white">
                                                                {project.title}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                                                    <div className="line-clamp-2">{project.description}</div>
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                    {project.project_url && (
                                                        <a
                                                            href={project.project_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                                                        >
                                                            <FaLink className="h-4 w-4" />
                                                            <span>Projeyi Gör</span>
                                                        </a>
                                                    )}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                    <div className="flex items-center gap-1">
                                                        <FaClock className="h-4 w-4" />
                                                        <span>
                                                            {format(new Date(project.created_at), 'dd MMM yyyy', { locale: tr })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleEdit(project)}
                                                            className="text-primary hover:text-primary/80 transition-colors"
                                                            title="Düzenle"
                                                        >
                                                            <FaEdit className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(project)}
                                                            className="text-red-500 hover:text-red-600 transition-colors"
                                                            title="Sil"
                                                        >
                                                            <FaTrash className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {projects.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">Henüz proje eklenmemiş</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProjectModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                mode={selectedProject ? 'edit' : 'create'}
            />

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeleteConfirm}
                title={selectedProject?.title || ''}
                isDeleting={isDeleting}
            />
        </div>
    )
} 