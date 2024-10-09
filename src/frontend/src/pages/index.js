import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Button, Box } from '@mui/material';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          throw new Error('Falha na autenticação');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleRegisterProfessional = () => {
    router.push('/register');
  };

  const handleListProfessionals = () => {
    router.push('/list');
  };

  if (!user) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Bem-vindo, {user.email}!</Typography>
      <Box display="flex" flexDirection="column" gap={2} mt={4}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleRegisterProfessional}
        >
          Cadastrar Profissional
        </Button>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleListProfessionals}
        >
          Listar Profissionais
        </Button>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;