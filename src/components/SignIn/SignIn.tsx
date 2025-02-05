"use client";

import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { TextField, Button, Typography, Container, Box, createTheme, ThemeProvider } from '@mui/material';
import styles from './SignIn.module.css';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#a855f7', // purple-600
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#27272a', // zinc-800
              '&:hover fieldset': {
                borderColor: '#a855f7', // purple-600
              },
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#9CA3AF', // gray-400
            '&.Mui-focused': {
              color: '#A78BFA', // purple-400
            },
          },
        },
      },
    },
  });

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!email || !password) {
      setMessage('Email and password are required');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(`Error signing in: ${error.message}`);
    } else {
      setMessage('Sign-in successful');
      router.push('/home');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <ThemeProvider theme={darkTheme}>
          <div className={styles.formWrapper}>
            <h2 className={styles.title}>Welcome Back</h2>
            
            {message && (
              <div className={styles.message}>
                {message}
              </div>
            )}

            <form onSubmit={handleSignIn} className={styles.form}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                variant="outlined"
              />

              <Button 
                type="submit"
                variant="contained"
                fullWidth
                className={styles.button}
                size="large"
              >
                Sign In
              </Button>
            </form>

            <p className={styles.footer}>
              Don't have an account?{' '}
              <Link href="/signup" legacyBehavior>
                <a className={styles.link}>Sign up</a>
              </Link>
            </p>
          </div>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default SignIn;