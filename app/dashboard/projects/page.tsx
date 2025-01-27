'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/app/utils/supabase/client'
import { toast } from 'react-hot-toast'
import { FaPlus, FaLink, FaImage, FaClock, FaEdit, FaTrash, FaGripVertical } from 'react-icons/fa'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import ProjectModal from '@/app/components/modals/ProjectModal'
import DeleteConfirmModal from '@/app/components/modals/DeleteConfirmModal'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Project } from '@/app/types'



interface ProjectFormData {
    title: string
    description: string
    image_url: string
    project_url: string
}

type DraggableRowProps = {
    project: Project
    index: number
    moveRow: (dragIndex: number, hoverIndex: number) => void
    handleEdit: (project: Project) => void
    handleDelete: (project: Project) => void
}

const DraggableRow = ({ project, index, moveRow, handleEdit, handleDelete }: DraggableRowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: project.id
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className="group hover:bg-gray-50 dark:hover:bg-gray-800/50"
            {...attributes}
        >
            <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div className="flex items-center gap-4">
                    <div
                        {...listeners}
                        className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <FaGripVertical className="h-5 w-5 text-gray-400" />
                    </div>
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
    )
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
                .order('sort_order', { ascending: true })

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
            const projectData = {
                ...formData,
                sort_order: selectedProject ? selectedProject.sort_order : projects.length,
            }

            if (selectedProject) {
                const { error } = await supabase
                    .from('projects')
                    .update(projectData)
                    .eq('id', selectedProject.id)

                if (error) throw error
                toast.success('Proje başarıyla güncellendi')
            } else {
                const { error } = await supabase
                    .from('projects')
                    .insert([projectData])

                if (error) throw error
                toast.success('Proje başarıyla eklendi')
            }

            handleCloseModal()
            await loadProjects()
        } catch (error: any) {
            console.error('Error saving project:', error)
            toast.error(error?.message || 'Proje kaydedilirken bir hata oluştu')
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

    const moveRow = useCallback(async (dragIndex: number, hoverIndex: number) => {
        const draggedProject = projects[dragIndex]
        const newProjects = [...projects]
        newProjects.splice(dragIndex, 1)
        newProjects.splice(hoverIndex, 0, draggedProject)

        const updatedProjects = newProjects.map((project, index) => ({
            ...project,
            sort_order: index
        }))

        setProjects(updatedProjects)


        try {
            const { error } = await supabase
                .from('projects')
                .upsert(
                    updatedProjects.map(({ id, title, description, image_url, project_url, sort_order }) => ({
                        id,
                        title,
                        description,
                        image_url,
                        project_url,
                        sort_order
                    }))
                )

            if (error) throw error
            toast.success('Sıralama başarıyla güncellendi')
        } catch (error) {
            console.error('Error updating sort order:', error)
            toast.error('Sıralama güncellenirken bir hata oluştu')
            await loadProjects()
        }
    }, [projects, supabase, loadProjects])

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            const activeIndex = projects.findIndex(p => p.id === active.id)
            const overIndex = projects.findIndex(p => p.id === over.id)
            moveRow(activeIndex, overIndex)
        }
    }, [projects, moveRow])

    return (
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
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
                            <div className="overflow-x-auto">
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
                                                {projects.map((project, index) => (
                                                    <DraggableRow
                                                        key={project.id}
                                                        project={project}
                                                        index={index}
                                                        moveRow={moveRow}
                                                        handleEdit={handleEdit}
                                                        handleDelete={handleDelete}
                                                    />
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
                        onCancel={handleCloseDeleteModal}
                        onConfirm={handleDeleteConfirm}
                        title={selectedProject?.title || ''}
                        message={`"${selectedProject?.title}" projesini silmek istediğinize emin misiniz?`}
                        isLoading={isDeleting}
                    />
                </div>
            </SortableContext>
        </DndContext>
    )
} 