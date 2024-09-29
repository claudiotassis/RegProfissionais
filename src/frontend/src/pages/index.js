// src/frontend/src/pages/index.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/router';

const Home = () => {
  const [userName, setUserName] = useState('');
  const router = useRouter();

  // Busca o nome do usuário ao carregar a página
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token'); // Assume que o token está armazenado no localStorage
      const response = await fetch('http://localhost:3001/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserName(data.name); // Define o nome do usuário
      } else {
        setUserName(''); // Se der erro, remove o nome
      }
    };

    fetchUser();
  }, []);

  const goToRegisterPage = () => {
    router.push('/register');
  };

  const goToListPage = () => {
    router.push('/list');
  };

  return (
    <Container>
      <Typography variant="h4">Bem-vindo à página de Gestão Profissional, {userName || 'Usuário'}!</Typography>
      <Box display="flex" flexDirection="column" alignItems="center" marginTop={4}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={goToRegisterPage} 
          style={{ marginBottom: '20px', width: '200px' }}
        >
          Registrar Profissional
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={goToListPage} 
          style={{ width: '200px' }}
        >
          Listar Profissionais
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
