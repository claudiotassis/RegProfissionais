import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const API_URL = '/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Verifica se já está autenticado
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorDetails('');

    try {
      console.log('API_URL:', API_URL);
      console.log('Tentando fazer login com:', { email, password });
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      console.log('Resposta recebida:', response);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        console.log('Login bem-sucedido:', data);
        
        // Adiciona um pequeno atraso antes do redirecionamento
        setTimeout(() => {
          router.push('/');
        }, 100);
      } else {
        const text = await response.text();
        console.error('Erro no login. Resposta:', text);
        setErrorDetails(`Status: ${response.status}, Corpo: ${text.substring(0, 200)}...`);
      }
    } catch (error) {
      console.error('Erro detalhado:', error);
      setErrorDetails(`Erro: ${error.message}, Tipo: ${error.name}, Stack: ${error.stack}`);
    }
  };

  const testConnection = async () => {
    try {
      console.log('Testando conexão com:', `${API_URL}/test`);
      const response = await fetch(`${API_URL}/test`, {
        method: 'GET',
        credentials: 'include',
      });
      const text = await response.text();
      console.log('Teste de conexão. Resposta:', text);
      setErrorDetails(`Conexão testada. Status: ${response.status}, Corpo: ${text.substring(0, 200)}...`);
    } catch (error) {
      console.error('Erro no teste de conexão:', error);
      setErrorDetails(`Erro de conexão: ${error.message}, Tipo: ${error.name}, Stack: ${error.stack}`);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Login</Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </form>
      <Button onClick={testConnection} variant="outlined" style={{ marginTop: '20px' }}>
        Testar Conexão
      </Button>
      {errorDetails && (
        <Typography color="error" style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
          Detalhes do erro: {errorDetails}
        </Typography>
      )}
    </Container>
  );
};

export default LoginPage;