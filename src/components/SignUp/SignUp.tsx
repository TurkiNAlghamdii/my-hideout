"use client";

import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { TextField, Button, Typography, Container, Box, createTheme, ThemeProvider } from '@mui/material';
import styles from './SignUp.module.css';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
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

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!username || !email || !password) {
      setMessage('Username, email, and password are required');
      return;
    }

    // Proceed with sign-up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(`Error signing up: ${error.message}`);
      return;
    }

    const user = data.user;
    if (user) {
      // Check if the username is unique
      const { data: existingUser, error: userCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (userCheckError && userCheckError.code !== 'PGRST116') {
        setMessage(`Error checking username: ${userCheckError.message}`);
        return;
      }

      if (existingUser) {
        setMessage('Username already exists. Please choose a different username.');
        return;
      }

      // Save the username in the database
      const { error: userError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, username }]);

      if (userError) {
        if (userError.message.includes('violates foreign key constraint')) {
          setMessage('User already exists with this email. Please log in.');
        } else {
          setMessage(`Error saving username: ${userError.message}`);
        }
      } else {
        setIsSuccess(true);
        setMessage('Sign-up successful! Please check your email for verification.');
        setTimeout(() => {
          router.push('/signin');
        }, 3000);
      }
    } else {
      setIsSuccess(true);
      setMessage('Sign-up successful! Please check your email for verification.');
      setTimeout(() => {
        router.push('/signin');
      }, 3000);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <ThemeProvider theme={darkTheme}>
          <div className={styles.formWrapper}>
            <h2 className={styles.title}>Create Account</h2>
            
            {message && (
              <div className={`${styles.message} ${isSuccess ? styles.successMessage : ''}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSignUp} className={styles.form}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                variant="outlined"
                disabled={isSuccess}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                variant="outlined"
                disabled={isSuccess}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                disabled={isSuccess}
              />

              <Button 
                type="submit"
                variant="contained"
                fullWidth
                className={styles.button}
                size="large"
                disabled={isSuccess}
              >
                Sign Up
              </Button>
            </form>

            <p className={styles.footer}>
              Already have an account?{' '}
              <Link href="/signin" legacyBehavior>
                <a className={styles.link}>Sign in</a>
              </Link>
            </p>
          </div>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default SignUp;