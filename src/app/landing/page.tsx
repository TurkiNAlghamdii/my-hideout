import Link from 'next/link';
import styles from './landing.module.css';

const LandingPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>Welcome to My Blog</h2>
          <p className={styles.subtitle}>
            Share your thoughts and connect with others
          </p>
          
          <div className={styles.buttonContainer}>
            <Link 
              href="/signin" 
              className={styles.primaryButton}
            >
              Sign In
            </Link>
            <Link 
              href="/signup"
              className={styles.secondaryButton}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;