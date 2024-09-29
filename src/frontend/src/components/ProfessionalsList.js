// src/frontend/src/components/ProfessionalsList.js
import React, { useState } from 'react';
import { Typography, Button, TextField, Box, Grid } from '@mui/material';

const ProfessionalsList = ({ professionals, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null); // Armazena o ID do profissional sendo editado
  const [editFormData, setEditFormData] = useState({}); // Armazena os dados editáveis

  const handleEditClick = (professional) => {
    setEditingId(professional.id);
    setEditFormData({
      name: professional.name,
      email: professional.email,
      qualifications: professional.qualifications.join(', '),
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveClick = async (id) => {
    try {
      await onUpdate(id, {
        ...editFormData,
        qualifications: editFormData.qualifications.split(',').map(q => q.trim()), // Converte a string de qualificações para um array
      });
      setEditingId(null); // Após salvar, sai do modo de edição
    } catch (error) {
      alert('Erro ao atualizar profissional: ' + error.message); // Exibe erro ao atualizar
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box marginTop={3}>
      {professionals.map((professional) => (
        <Box key={professional.id} padding={2} border={1} marginBottom={2}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant="body1"><strong>ID:</strong></Typography>
              <Typography>{professional.id}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1"><strong>Nome:</strong></Typography>
              {editingId === professional.id ? (
                <TextField
                  name="name"
                  value={editFormData.name}
                  onChange={handleInputChange}
                  fullWidth
                />
              ) : (
                <Typography>{professional.name}</Typography>
              )}
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1"><strong>Email:</strong></Typography>
              {editingId === professional.id ? (
                <TextField
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  fullWidth
                />
              ) : (
                <Typography>{professional.email}</Typography>
              )}
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1"><strong>Qualificações:</strong></Typography>
              {editingId === professional.id ? (
                <TextField
                  name="qualifications"
                  value={editFormData.qualifications}
                  onChange={handleInputChange}
                  fullWidth
                />
              ) : (
                <Typography>{professional.qualifications.join(', ')}</Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Box marginTop={2}>
                {editingId === professional.id ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSaveClick(professional.id)} // Chama a função para salvar as edições
                      style={{ marginRight: '10px' }}
                    >
                      Salvar
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancelClick}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditClick(professional)} // Chama a função para entrar em modo de edição
                      style={{ marginRight: '10px' }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => onDelete(professional.id)} // Chama a função para deletar
                    >
                      Deletar
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default ProfessionalsList;
