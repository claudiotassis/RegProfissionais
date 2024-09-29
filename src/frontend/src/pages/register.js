// src/frontend/src/pages/register.js
import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Snackbar, Box } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from 'next/router';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [qualifications, setQualifications] = useState(['']);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/professionals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          qualifications: qualifications.filter(q => q).map(q => q.trim()),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao registrar profissional');
      }

      setMessage('Profissional registrado com sucesso!');
      setSeverity('success');
      setName('');
      setEmail('');
      setQualifications(['']);
    } catch (error) {
      console.error('Erro ao registrar profissional:', error);
      setMessage('Erro ao registrar profissional: ' + error.message);
      setSeverity('error');
    }
  };

  const handleClose = () => {
    setMessage('');
  };

  const handleAddQualification = () => {
    setQualifications([...qualifications, '']);
  };

  const handleRemoveQualification = (index) => {
    const newQualifications = qualifications.filter((_, i) => i !== index);
    setQualifications(newQualifications);
  };

  const handleQualificationChange = (index, value) => {
    const newQualifications = [...qualifications];
    newQualifications[index] = value;
    setQualifications(newQualifications);
  };

  const goBackToHome = () => {
    router.push('/');
  };

  return (
    <Container>
      <Typography variant="h4" marginBottom={4}>Registrar Profissional</Typography>
      <form onSubmit={handleRegister}>
        <TextField
          label="Nome"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {qualifications.map((qualification, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <TextField
              label={`Qualificação ${index + 1}`}
              variant="outlined"
              fullWidth
              margin="normal"
              value={qualification}
              onChange={(e) => handleQualificationChange(index, e.target.value)}
              required
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleRemoveQualification(index)}
              style={{ marginLeft: '10px' }}
            >
              Remover
            </Button>
          </div>
        ))}

        {/* Agrupando os botões em um Box com flexbox para alinhamento */}
        <Box display="flex" justifyContent="flex-start" alignItems="center" marginTop={2}>
          <Button variant="outlined" color="primary" onClick={handleAddQualification}>
            Adicionar Qualificação
          </Button>
          <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '10px' }}>
            Registrar
          </Button>
        </Box>
      </form>

      <Snackbar open={!!message} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={severity}>
          {message}
        </MuiAlert>
      </Snackbar>

      <Button variant="outlined" color="secondary" onClick={goBackToHome} style={{ marginTop: '20px' }}>
        Voltar à página principal
      </Button>
    </Container>
  );
};

export default RegisterPage;
