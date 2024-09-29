// src/frontend/src/pages/register.js

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, TextField, Button, Box, Chip, Stack, Snackbar, Alert } from '@mui/material';

const RegisterProfessional = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('');
  const [qualifications, setQualifications] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const router = useRouter();

  const handleAddQualification = () => {
    if (qualification.trim() !== '') {
      setQualifications([...qualifications, qualification.trim()]);
      setQualification('');
    }
  };

  const handleRemoveQualification = (index) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Iniciando o processo de registro');
    console.log('Dados a serem enviados:', { name, email, qualifications });

    try {
      const response = await fetch('http://localhost:3001/professionals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, qualifications }),
      });

      console.log('Resposta recebida. Status:', response.status);
      
      const responseText = await response.text();
      console.log('Texto da resposta:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error('Erro ao fazer parse do JSON:', error);
        throw new Error('Resposta do servidor não é um JSON válido');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao registrar profissional');
      }

      console.log('Profissional registrado com sucesso:', data);
      setSnackbarMessage('Profissional cadastrado com sucesso!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      // Limpar o formulário
      setName('');
      setEmail('');
      setQualifications([]);

      // Opcional: redirecionar após um breve delay
      setTimeout(() => router.push('/list'), 2000);
    } catch (error) {
      console.error('Erro ao registrar profissional:', error);
      setSnackbarMessage(error.message || 'Erro ao cadastrar profissional');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Typography variant="h4" marginBottom={4}>Registrar Profissional</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
          type="email"
        />
        <Box display="flex" alignItems="center" marginY={2}>
          <TextField
            fullWidth
            label="Qualificação"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
          />
          <Button onClick={handleAddQualification} variant="contained" style={{ marginLeft: '10px' }}>
            Adicionar
          </Button>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" marginY={2}>
          {qualifications.map((qual, index) => (
            <Chip
              key={index}
              label={qual}
              onDelete={() => handleRemoveQualification(index)}
            />
          ))}
        </Stack>
        <Box display="flex" justifyContent="space-between" marginTop={4}>
          <Button type="submit" variant="contained" color="primary">
            Registrar
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => router.push('/list')}>
            Listar Profissionais
          </Button>
        </Box>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegisterProfessional;