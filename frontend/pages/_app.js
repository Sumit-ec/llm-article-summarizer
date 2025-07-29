import '../styles/globals.css';
import NavBar from '../components/NavBar';
import { useEffect } from 'react';
import { getTheme, setTheme } from '../utils/theme';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Initialize theme on app load
    const savedTheme = getTheme();
    setTheme(savedTheme);
  }, []);

  return (
    <>
      <NavBar />
      <Component {...pageProps} />
    </>
  );
} 