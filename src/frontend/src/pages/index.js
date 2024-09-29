// src/frontend/src/pages/index.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Button, Box } from '@mui/material';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Usuário não autenticado');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  if (!user) return <Typography>Carregando...</Typography>;

  return (
    <Container>
      <Typography variant="h4" marginBottom={4}>
        Bem-vindo, {user.email}!
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center" marginTop={4}>
        <Button variant="contained" color="primary" onClick={() => router.push('/register')} style={{ marginBottom: '20px', width: '200px' }}>
          Registrar Profissional
        </Button>
        <Button variant="contained" color="secondary" onClick={() => router.push('/list')} style={{ width: '200px' }}>
          Listar Profissionais
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
