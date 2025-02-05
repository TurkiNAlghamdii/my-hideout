"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';
import styles from './protected.module.css';

const ProtectedPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/signin');
      }
    };

    checkUser();
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Your Dashboard</h1>
        <p className={styles.description}>
          This is a protected page. Only authenticated users can see this content.
        </p>
      </div>
    </div>
  );
};

export default ProtectedPage;