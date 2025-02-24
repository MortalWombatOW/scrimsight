import { useAuth } from 'react-oidc-context';
import { Center, Loader, Text } from '@mantine/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const CallbackPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth.isAuthenticated, navigate]);

  if (auth.error) {
    return (
      <Center style={{ height: '100vh' }}>
        <Text color="red">Authentication Error: {auth.error.message}</Text>
      </Center>
    );
  }

  return (
    <Center style={{ height: '100vh' }}>
      <Loader size="xl" />
    </Center>
  );
}; 