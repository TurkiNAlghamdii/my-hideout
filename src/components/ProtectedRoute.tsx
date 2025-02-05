import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/signin');
      } else {
        setAuthenticated(true);
      }
    };
    checkSession();
  }, [router]);

  if (!authenticated) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;