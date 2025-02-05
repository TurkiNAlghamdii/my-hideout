"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './projects.module.css';

interface Project {
  id: number;
  title: string;
  description: string;
  project_url: string;
  created_at: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    project_url: ''
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    checkAdminStatus();
    fetchProjects();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(profile?.is_admin || false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProject = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .insert([{
          title: newProject.title,
          description: newProject.description,
          project_url: newProject.project_url
        }]);

      if (error) throw error;

      setNewProject({ title: '', description: '', project_url: '' });
      setShowAddModal(false);
      fetchProjects();
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  const handleEditProject = async () => {
    if (!editingProject) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: editingProject.title,
          description: editingProject.description,
          project_url: editingProject.project_url
        })
        .eq('id', editingProject.id);

      if (error) throw error;

      setShowEditModal(false);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete.id);

      if (error) throw error;

      setShowDeleteModal(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.projectsContainer}>
          <h1 className={styles.title}>Projects</h1>
          
          {isAdmin && (
            <div className={styles.adminControls}>
              <button 
                className={styles.addButton}
                onClick={() => setShowAddModal(true)}
              >
                Add New Project
              </button>
            </div>
          )}

          {/* Add Project Modal */}
          {showAddModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2 className={styles.modalTitle}>Add New Project</h2>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  className={styles.input}
                />
                <textarea
                  placeholder="Project Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  className={styles.textarea}
                />
                <input
                  type="url"
                  placeholder="Project URL"
                  value={newProject.project_url}
                  onChange={(e) => setNewProject(prev => ({
                    ...prev,
                    project_url: e.target.value
                  }))}
                  className={styles.input}
                />
                <div className={styles.modalButtons}>
                  <button
                    onClick={handleAddProject}
                    className={styles.saveButton}
                  >
                    Save Project
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setNewProject({ title: '', description: '', project_url: '' });
                    }}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Project Modal */}
          {showEditModal && editingProject && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2 className={styles.modalTitle}>Edit Project</h2>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject(prev => ({
                    ...prev!,
                    title: e.target.value
                  }))}
                  className={styles.input}
                />
                <textarea
                  placeholder="Project Description"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject(prev => ({
                    ...prev!,
                    description: e.target.value
                  }))}
                  className={styles.textarea}
                />
                <input
                  type="url"
                  placeholder="Project URL"
                  value={editingProject.project_url}
                  onChange={(e) => setEditingProject(prev => ({
                    ...prev!,
                    project_url: e.target.value
                  }))}
                  className={styles.input}
                />
                <div className={styles.modalButtons}>
                  <button
                    onClick={handleEditProject}
                    className={styles.saveButton}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingProject(null);
                    }}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && projectToDelete && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2 className={styles.modalTitle}>Delete Project</h2>
                <p className={styles.deleteConfirmation}>
                  Are you sure you want to delete "{projectToDelete.title}"? This action cannot be undone.
                </p>
                <div className={styles.modalButtons}>
                  <button
                    onClick={handleDeleteProject}
                    className={styles.deleteButton}
                  >
                    Delete Project
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setProjectToDelete(null);
                    }}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={styles.projectsGrid}>
            {projects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <div className={styles.projectInfo}>
                  <h2 className={styles.projectTitle}>{project.title}</h2>
                  <p className={styles.projectDescription}>{project.description}</p>
                  <a 
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.projectLink}
                  >
                    View Project →
                  </a>
                  {isAdmin && (
                    <div className={styles.adminButtons}>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEditClick(project)}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDeleteClick(project)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;