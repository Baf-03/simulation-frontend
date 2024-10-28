import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logoIcon}>🩺</span>Simulation manager
        </Link>
      </div>

      <div className={styles.hamburger} onClick={toggleMenu}>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </div>

      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
        <Link to="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          Patient Table
        </Link>
        <Link to="/statistics" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          Statistics
        </Link>
      </nav>
    </header>
  );
};

export default Header;
