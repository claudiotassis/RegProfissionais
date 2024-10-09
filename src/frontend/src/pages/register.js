import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, TextField, Button, Box, Stack, Snackbar, Alert, Grid } from '@mui/material';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const RegisterProfessional = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [qualifications, setQualifications] = useState([{ id: 1, value: '' }]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const router = useRouter();

  const handleQualificationChange = (index, newValue) => {
    const newQualifications = qualifications.map((qual, i) =>
      i === index ? { ...qual, value: newValue } : qual
    );
    setQualifications(newQualifications);
  };

  const handleAddQualification = () => {
    setQualifications([...qualifications, { id: qualifications.length + 1, value: '' }]);
  };

  const handleRemoveQualification = (index) => {
    if (qualifications.length > 1) {
      setQualifications(qualifications.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qualificationValues = qualifications.map((qual) => qual.value).filter((val) => val !== '');
    
    try {
      const token = localStorage.getItem('token');
      console.log('Enviando requisição para:', `${API_URL}/professionals`);
      const response = await fetch(`${API_URL}/professionals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, qualifications: qualificationValues }),
      });

      console.log('Resposta recebida:', response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao registrar profissional');
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);

      setSnackbarMessage('Profissional cadastrado com sucesso!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      // Limpar o formulário
      setName('');
      setEmail('');
      setQualifications([{ id: 1, value: '' }]);

      // Redirecionar após 2 segundos
      setTimeout(() => router.push('/list'), 2000);
    } catch (error) {
      console.error('Erro detalhado:', error);
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

        {qualifications.map((qualification, index) => (
          <Grid container spacing={2} key={qualification.id} alignItems="center" sx={{ marginY: 1 }}>
            <Grid item xs={10}>
              <TextField
                fullWidth
                label={`Qualificação ${index + 1}`}
                value={qualification.value}
                onChange={(e) => handleQualificationChange(index, e.target.value)}
                margin="normal"
                style={{ width: '100%' }}
              />
            </Grid>

            <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                onClick={() => handleRemoveQualification(index)}
                color="primary"
                style={{ cursor: 'pointer', marginRight: 8 }}
              >
                REMOVER
              </Typography>
            </Grid>
          </Grid>
        ))}

        <Typography
          onClick={handleAddQualification}
          color="primary"
          style={{ cursor: 'pointer', marginTop: 16, marginBottom: 24 }}
        >
          ADICIONAR QUALIFICAÇÃO
        </Typography>

        <Box display="flex" justifyContent="space-between" marginTop={4}>
          <Button type="submit" variant="contained" color="primary">
            Cadastrar
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