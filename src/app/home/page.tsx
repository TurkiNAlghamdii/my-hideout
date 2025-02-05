"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './page.module.css';

const HomePage = () => {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);
    };

    checkUser();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 20, 
      opacity: 0,
      rotateX: -15
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.3
      }
    }
  };

  const cardHoverVariants = {
    initial: {
      boxShadow: "0px 0px 0px rgba(148, 163, 184, 0.1)"
    },
    hover: {
      y: -12,
      rotateX: 10,
      scale: 1.05,
      boxShadow: "0px 20px 40px rgba(148, 163, 184, 0.2)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    },
    tap: {
      scale: 0.98,
      rotateX: 0,
      boxShadow: "0px 5px 10px rgba(148, 163, 184, 0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    }
  };

  const handleCardClick = (route: string) => {
    if (route.startsWith('http')) {
      window.open(route, '_blank', 'noopener,noreferrer');
    } else {
      router.push(route);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div 
          className={styles.loadingSpinner}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <motion.main 
        className={styles.mainContent}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className={styles.animationSection}>
          <motion.div 
            className={styles.gifContainer}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Image
              src={process.env.NODE_ENV === 'production' ? '/my-hideout/drive.GIF' : '/drive.GIF'}
              alt="Dragon Animation"
              width={800}
              height={600}
              className={styles.dragonGif}
              priority
            />
          </motion.div>
        </div>

        <div className={styles.heroSection}>
          <motion.h1 
            className={styles.heroTitle}
            variants={itemVariants}
          >
            Welcome to Tobi's Hideout
          </motion.h1>
          <motion.p 
            className={styles.heroSubtitle}
            variants={itemVariants}
          >
            My personal space for creativity and productivity
          </motion.p>
        </div>

        <motion.div 
          className={styles.cardGrid}
          variants={containerVariants}
        >
          {session ? (
            <>
              <motion.div 
                className={styles.card}
                variants={{
                  ...itemVariants,
                  ...cardHoverVariants
                }}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleCardClick('/projects')}
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Projects</h3>
                  <p className={styles.cardDescription}>
                    Explore my latest projects and developments
                  </p>
                  <div className={styles.cardArrow}>→</div>
                </div>
              </motion.div>

              <motion.div 
                className={styles.card}
                variants={{
                  ...itemVariants,
                  ...cardHoverVariants
                }}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleCardClick('/socials')}
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Social Links</h3>
                  <p className={styles.cardDescription}>
                    Connect with me on various platforms
                  </p>
                  <div className={styles.cardArrow}>→</div>
                </div>
              </motion.div>

              <motion.div 
                className={styles.card}
                variants={{
                  ...itemVariants,
                  ...cardHoverVariants
                }}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleCardClick('/profile')}
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Profile</h3>
                  <p className={styles.cardDescription}>
                    View and manage your profile settings
                  </p>
                  <div className={styles.cardArrow}>→</div>
                </div>
              </motion.div>

              <motion.div 
                className={styles.card}
                variants={{
                  ...itemVariants,
                  ...cardHoverVariants
                }}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleCardClick('https://github.com/turkinalghamdii')}
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>GitHub</h3>
                  <p className={styles.cardDescription}>
                    Check out my open source contributions
                  </p>
                  <div className={styles.cardArrow}>→</div>
                </div>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div 
                className={styles.card}
                variants={{
                  ...itemVariants,
                  ...cardHoverVariants
                }}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleCardClick('/projects')}
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Projects</h3>
                  <p className={styles.cardDescription}>
                    Explore my latest projects and developments
                  </p>
                  <div className={styles.cardArrow}>→</div>
                </div>
              </motion.div>

              <motion.div 
                className={styles.card}
                variants={{
                  ...itemVariants,
                  ...cardHoverVariants
                }}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleCardClick('/socials')}
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Social Links</h3>
                  <p className={styles.cardDescription}>
                    Connect with me on various platforms
                  </p>
                  <div className={styles.cardArrow}>→</div>
                </div>
              </motion.div>

              <motion.div 
                className={styles.card}
                variants={{
                  ...itemVariants,
                  ...cardHoverVariants
                }}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleCardClick('/signin')}
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>Sign In</h3>
                  <p className={styles.cardDescription}>
                    Sign in to access more features
                  </p>
                  <div className={styles.cardArrow}>→</div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default HomePage;