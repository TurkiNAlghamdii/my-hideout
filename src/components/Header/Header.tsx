"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import styles from './Header.module.css';

const Header = () => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/home" legacyBehavior>
          <a className={styles.logo}>TOBI</a>
        </Link>
        
        <div className={styles.navLinks}>
          <Link href="/home" legacyBehavior>
            <a className={styles.navLink}>Home</a>
          </Link>
          <Link href="/projects" legacyBehavior>
            <a className={styles.navLink}>Projects</a>
          </Link>
          <Link href="/socials" legacyBehavior>
            <a className={styles.navLink}>Socials</a>
          </Link>
        </div>
        
        <div className={styles.authButtons}>
          {session ? (
            <>
              <Link href="/profile" legacyBehavior>
                <a className={styles.navLink}>Profile</a>
              </Link>
              <button onClick={handleSignOut} className={styles.signOutButton}>
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/signin" legacyBehavior>
              <a className={styles.signInButton}>Sign In</a>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;