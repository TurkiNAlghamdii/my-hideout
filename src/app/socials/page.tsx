"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaYoutube, FaTwitch, FaGlobe } from 'react-icons/fa';
import styles from './socials.module.css';

interface Social {
  id: number;
  platform: string;
  url: string;
  created_at: string;
}

const PLATFORM_ICONS: { [key: string]: React.ReactElement } = {
  GitHub: <FaGithub className={styles.icon} />,
  LinkedIn: <FaLinkedin className={styles.icon} />,
  Twitter: <FaTwitter className={styles.icon} />,
  Instagram: <FaInstagram className={styles.icon} />,
  YouTube: <FaYoutube className={styles.icon} />,
  Twitch: <FaTwitch className={styles.icon} />,
  Website: <FaGlobe className={styles.icon} />,
};

const PLATFORMS = Object.keys(PLATFORM_ICONS);

const SocialsPage = () => {
  const [socials, setSocials] = useState<Social[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [socialToDelete, setSocialToDelete] = useState<Social | null>(null);
  const [newSocial, setNewSocial] = useState({
    platform: '',
    url: ''
  });
  const [editingSocial, setEditingSocial] = useState<Social | null>(null);

  useEffect(() => {
    checkAdminStatus();
    fetchSocials();
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

  const fetchSocials = async () => {
    try {
      const { data, error } = await supabase
        .from('socials')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSocials(data || []);
    } catch (error) {
      console.error('Error fetching socials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSocial = async () => {
    try {
      const { error } = await supabase
        .from('socials')
        .insert([{
          platform: newSocial.platform,
          url: newSocial.url
        }]);

      if (error) throw error;

      setNewSocial({ platform: '', url: '' });
      setShowAddModal(false);
      fetchSocials();
    } catch (error) {
      console.error('Error adding social:', error);
    }
  };

  const handleEditClick = (social: Social) => {
    setEditingSocial(social);
    setShowEditModal(true);
  };

  const handleEditSocial = async () => {
    if (!editingSocial) return;

    try {
      const { error } = await supabase
        .from('socials')
        .update({
          platform: editingSocial.platform,
          url: editingSocial.url
        })
        .eq('id', editingSocial.id);

      if (error) throw error;

      setShowEditModal(false);
      setEditingSocial(null);
      fetchSocials();
    } catch (error) {
      console.error('Error updating social:', error);
    }
  };

  const handleDeleteClick = (social: Social) => {
    setSocialToDelete(social);
    setShowDeleteModal(true);
  };

  const handleDeleteSocial = async () => {
    if (!socialToDelete) return;

    try {
      const { error } = await supabase
        .from('socials')
        .delete()
        .eq('id', socialToDelete.id);

      if (error) throw error;

      setShowDeleteModal(false);
      setSocialToDelete(null);
      fetchSocials();
    } catch (error) {
      console.error('Error deleting social:', error);
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
        <div className={styles.socialsContainer}>
          <h1 className={styles.title}>Connect With Me</h1>
          <p className={styles.subtitle}>Find me on social media</p>
          
          {isAdmin && (
            <div className={styles.adminControls}>
              <button 
                className={styles.addButton}
                onClick={() => setShowAddModal(true)}
              >
                Add New Social Link
              </button>
            </div>
          )}

          <div className={styles.socialsGrid}>
            {socials.map((social) => (
              <div key={social.id} className={styles.socialCard}>
                <a 
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  {PLATFORM_ICONS[social.platform]}
                  <span className={styles.platformName}>{social.platform}</span>
                </a>
                {isAdmin && (
                  <div className={styles.adminButtons}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleEditClick(social)}
                    >
                      Edit
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteClick(social)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Social Modal */}
          {showAddModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2 className={styles.modalTitle}>Add New Social Link</h2>
                <select
                  value={newSocial.platform}
                  onChange={(e) => setNewSocial(prev => ({
                    ...prev,
                    platform: e.target.value
                  }))}
                  className={styles.select}
                >
                  <option value="">Select Platform</option>
                  {PLATFORMS.map(platform => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  placeholder="Social Link URL"
                  value={newSocial.url}
                  onChange={(e) => setNewSocial(prev => ({
                    ...prev,
                    url: e.target.value
                  }))}
                  className={styles.input}
                />
                <div className={styles.modalButtons}>
                  <button
                    onClick={handleAddSocial}
                    className={styles.saveButton}
                    disabled={!newSocial.platform || !newSocial.url}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setNewSocial({ platform: '', url: '' });
                    }}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Social Modal */}
          {showEditModal && editingSocial && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2 className={styles.modalTitle}>Edit Social Link</h2>
                <select
                  value={editingSocial.platform}
                  onChange={(e) => setEditingSocial(prev => ({
                    ...prev!,
                    platform: e.target.value
                  }))}
                  className={styles.select}
                >
                  <option value="">Select Platform</option>
                  {PLATFORMS.map(platform => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  placeholder="Social Link URL"
                  value={editingSocial.url}
                  onChange={(e) => setEditingSocial(prev => ({
                    ...prev!,
                    url: e.target.value
                  }))}
                  className={styles.input}
                />
                <div className={styles.modalButtons}>
                  <button
                    onClick={handleEditSocial}
                    className={styles.saveButton}
                    disabled={!editingSocial.platform || !editingSocial.url}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingSocial(null);
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
          {showDeleteModal && socialToDelete && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2 className={styles.modalTitle}>Delete Social Link</h2>
                <p className={styles.deleteConfirmation}>
                  Are you sure you want to delete your {socialToDelete.platform} link? This action cannot be undone.
                </p>
                <div className={styles.modalButtons}>
                  <button
                    onClick={handleDeleteSocial}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSocialToDelete(null);
                    }}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SocialsPage;