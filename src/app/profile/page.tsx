"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './profile.module.css';

interface Profile {
  username: string;
  email: string;
  avatar_url?: string | null;
}

const ProfilePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProfile = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        router.push('/signin');
        return;
      }

      // First get the profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.log('Error fetching profile:', profileError);
        return;
      }

      // Set initial profile without picture
      setProfile({
        username: profileData.username,
        email: session.user.email || '',
        avatar_url: null
      });

      // Try to get the profile picture
      try {
        // First check if the file exists
        const { data: listData } = await supabase
          .storage
          .from('profile-pictures')
          .list('public');

        const userFile = listData?.find(file => file.name === `${session.user.id}.png`);
        
        if (userFile) {
          const { data, error } = await supabase.storage
            .from('profile-pictures')
            .download(`public/${session.user.id}.png`);

          if (error) {
            throw error;
          }

          if (data) {
            // Revoke the old URL if it exists
            if (profile?.avatar_url) {
              URL.revokeObjectURL(profile.avatar_url);
            }
            
            // Create new URL
            const url = URL.createObjectURL(data);
            setProfile(prev => ({
              ...prev!,
              avatar_url: url
            }));
          }
        }
      } catch (storageError) {
        console.log('Storage error:', storageError);
        if (storageError instanceof Error) {
          console.log('Error message:', storageError.message);
          console.log('Error name:', storageError.name);
        }
      }
      
    } catch (error) {
      console.log('Error in fetchProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setErrorMessage('Please sign in to update your profile picture');
        return;
      }

      const filePath = `public/${session.user.id}.png`;
      
      const { error } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, { upsert: true });

      if (error) {
        setErrorMessage('Error uploading profile picture: ' + error.message);
      } else {
        // Revoke old URL if it exists
        if (profile?.avatar_url) {
          URL.revokeObjectURL(profile.avatar_url);
        }
        
        // Force a fresh fetch of the profile picture
        await fetchProfile();
      }

    } catch (error) {
      console.error('Error in handleImageChange:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (!newUsername.trim()) return;
    
    try {
      setErrorMessage(''); // Clear any previous errors
      setUpdateLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setErrorMessage('Please sign in to update your username');
        return;
      }

      // First check if username already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', newUsername.trim())
        .single();

      if (existingUser) {
        setErrorMessage('This username is already taken. Please choose another one.');
        return;
      }

      // If username is available, proceed with update
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username: newUsername.trim() })
        .eq('id', session.user.id);

      if (updateError) {
        setErrorMessage('Error updating username. Please try again.');
        return;
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, username: newUsername.trim() } : null);
      setIsEditing(false);
      
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setUpdateLoading(false);
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
        <div className={styles.profileCard}>
          <h2 className={styles.title}>Your Profile</h2>
          
          <div className={styles.avatarSection}>
            <div 
              className={styles.avatarContainer}
              onClick={() => fileInputRef.current?.click()}
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {profile?.username?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div className={styles.avatarOverlay}>
                {uploading ? 'Uploading...' : 'Change Photo'}
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoItem}>
              <label className={styles.label}>Username</label>
              {isEditing ? (
                <div className={styles.editContainer}>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className={styles.editInput}
                    placeholder="Enter new username"
                    autoFocus
                  />
                  {errorMessage && (
                    <p className={styles.errorMessage}>{errorMessage}</p>
                  )}
                  <div className={styles.editButtons}>
                    <button 
                      onClick={handleUsernameUpdate}
                      disabled={updateLoading}
                      className={styles.saveButton}
                    >
                      {updateLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        setNewUsername('');
                        setErrorMessage(''); // Clear error when canceling
                      }}
                      className={styles.cancelButton}
                      disabled={updateLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.valueContainer}>
                  <p className={styles.value}>{profile?.username}</p>
                  <button 
                    onClick={() => {
                      setNewUsername(profile?.username || '');
                      setIsEditing(true);
                      setErrorMessage(''); // Clear error when starting edit
                    }}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
            
            <div className={styles.infoItem}>
              <label className={styles.label}>Email</label>
              <p className={styles.value}>{profile?.email}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;