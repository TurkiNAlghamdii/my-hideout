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

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (!session) {
          router.push('/signin');
          return;
        }
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile({
            username: profileData?.username || 'User',
            email: session.user.email || '',
            avatar_url: null
          });

          // Try to get the profile picture
          try {
            const { data: listData } = await supabase
              .storage
              .from('profile-pictures')
              .list('public');

            const userFile = listData?.find(file => file.name === `${session.user.id}.png`);
            
            if (userFile) {
              const { data } = await supabase.storage
                .from('profile-pictures')
                .download(`public/${session.user.id}.png`);

              if (data) {
                const url = URL.createObjectURL(data);
                setProfile(prev => prev ? { ...prev, avatar_url: url } : null);
              }
            }
          } catch (storageError) {
            console.error('Storage error:', storageError);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/signin');
      }
    };

    checkUser();

    // Cleanup function
    return () => {
      if (profile?.avatar_url) {
        URL.revokeObjectURL(profile.avatar_url);
      }
    };
  }, [router]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      setUploading(true);
      const file = event.target.files[0];
      const filePath = `public/${session.user.id}.png`;

      const { error } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, { upsert: true });

      if (error) {
        throw error;
      }

      // Refresh the profile data to show the new image
      const { data } = await supabase.storage
        .from('profile-pictures')
        .download(filePath);

      if (data) {
        const url = URL.createObjectURL(data);
        setProfile(prev => prev ? { ...prev, avatar_url: url } : null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return null;
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
}