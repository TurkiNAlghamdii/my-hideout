import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Tobi. All rights reserved.
          </p>
          
          <div className={styles.links}>
            <Link href="/privacy" className={styles.link}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={styles.link}>
              Terms of Service
            </Link>
            <Link href="/contact" className={styles.link}>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;