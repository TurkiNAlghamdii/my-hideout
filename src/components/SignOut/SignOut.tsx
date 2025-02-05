"use client";

import { supabase } from '../../utils/supabaseClient';

const SignOut = () => {
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
    else console.log('Sign-out successful');
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOut;