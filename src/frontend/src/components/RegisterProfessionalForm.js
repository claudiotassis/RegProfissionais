// src/frontend/src/components/RegisterProfessionalForm.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, TextField, Typography, Box } from '@mui/material';

const RegisterProfessionalForm = () => {
  const { register, handleSubmit } = useForm();
  const [qualifications, setQualifications] = useState(['']);
  const [errorMessage, setErrorMessage] = useState(''); // Estado para exibir a mensagem de erro

  const onSubmit = async (data) => {
    const response = await fetch('http://localhost:3001/api/professional', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        qualifications: qualifications.filter(q => q),
      }),
    });

    if (response.ok) {
      alert('Profissional registrado com sucesso!');
      setErrorMessage(''); // Limpa a mensagem de erro
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.error); // Define a mensagem de erro
    }
  };

  const addQualification = () => {
    setQualifications([...qualifications, '']);
  };

  const removeQualification = (index) => {
    const updatedQualifications = qualifications.filter((_, i) => i !== index);
    setQualifications(updatedQualifications);
  };

  const handleQualificationChange = (index, value) => {
    const updatedQualifications = [...qualifications];
    updatedQualifications[index] = value;
    setQualifications(updatedQualifications);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6">Registrar Profissional</Typography>
      <TextField
        label="Nome"
        variant="outlined"
        fullWidth
        margin="normal"
        {...register('name', { required: true })}
      />
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        {...register('email', { required: true })}
      />
      <Typography variant="h6">Qualificações</Typography>
      {qualifications.map((qual, index) => (
        <Box key={index} display="flex" alignItems="center" marginBottom={1}>
          <TextField
            label={`Qualificação ${index + 1}`}
            variant="outlined"
            fullWidth
            margin="normal"
            value={qual}
            onChange={(e) => handleQualificationChange(index, e.target.value)}
          />
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={() => removeQualification(index)} 
            style={{ marginLeft: '10px' }}
          >
            REMOVER
          </Button>
        </Box>
      ))}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={addQualification} 
        style={{ marginTop: '10px', marginRight: '10px' }}
      >
        Adicionar Qualificação
      </Button>
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        style={{ marginTop: '10px' }}
      >
        Registrar
      </Button>
      
      {/* Exibe a mensagem de erro, se existir */}
      {errorMessage && (
        <Typography color="error" variant="body2" style={{ marginTop: '10px' }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default RegisterProfessionalForm;
