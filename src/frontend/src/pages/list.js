// src/frontend/src/pages/list.js

import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, List, ListItem, ListItemText, Chip, Stack, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useRouter } from 'next/router';

const ListPage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [editingProfessional, setEditingProfessional] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newQualification, setNewQualification] = useState('');
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const router = useRouter();

  useEffect(() => {
    fetchProfessionals();
  }, []);

  useEffect(() => {
    filterAndSortProfessionals();
  }, [professionals, filterText, sortBy]);

  const fetchProfessionals = async () => {
    try {
      const response = await fetch('http://localhost:3001/professionals');
      if (!response.ok) {
        throw new Error('Erro ao buscar profissionais');
      }
      const data = await response.json();
      setProfessionals(data);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
      alert('Erro ao buscar profissionais');
    }
  };

  const filterAndSortProfessionals = () => {
    let filtered = professionals.filter(professional => 
      professional.name.toLowerCase().includes(filterText.toLowerCase()) ||
      professional.email.toLowerCase().includes(filterText.toLowerCase()) ||
      professional.qualifications.some(qual => qual.toLowerCase().includes(filterText.toLowerCase()))
    );

    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'email') {
        return a.email.localeCompare(b.email);
      } else if (sortBy === 'qualifications') {
        return a.qualifications.length - b.qualifications.length;
      }
      return 0;
    });

    setFilteredProfessionals(filtered);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:3001/professionals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar profissional');
      }

      setOpenDialog(false);
      fetchProfessionals();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar profissional: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este profissional?')) {
      try {
        const response = await fetch(`http://localhost:3001/professionals/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao deletar profissional');
        }
        fetchProfessionals();
      } catch (error) {
        console.error('Erro ao deletar:', error);
        alert('Erro ao deletar profissional: ' + error.message);
      }
    }
  };

  const handleEditClick = (professional) => {
    setEditingProfessional({ ...professional });
    setOpenDialog(true);
  };

  const handleAddQualification = () => {
    if (newQualification.trim() !== '') {
      setEditingProfessional({
        ...editingProfessional,
        qualifications: [...editingProfessional.qualifications, newQualification.trim()]
      });
      setNewQualification('');
    }
  };

  const handleRemoveQualification = (index) => {
    setEditingProfessional({
      ...editingProfessional,
      qualifications: editingProfessional.qualifications.filter((_, i) => i !== index)
    });
  };

  return (
    <Container>
      <Typography variant="h4" marginBottom={4}>Lista de Profissionais</Typography>
      
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <TextField
          label="Filtrar"
          variant="outlined"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ width: '70%' }}
        />
        <FormControl style={{ width: '25%' }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="name">Nome</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="qualifications">Qualificações</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <List>
        {filteredProfessionals.map((professional) => (
          <ListItem key={professional.id} divider>
            <ListItemText
              primary={professional.name}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {professional.email}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" marginTop={1}>
                    {professional.qualifications.map((qual, index) => (
                      <Chip key={index} label={qual} size="small" />
                    ))}
                  </Stack>
                </>
              }
            />
            <Button onClick={() => handleEditClick(professional)}>Editar</Button>
            <Button onClick={() => handleDelete(professional.id)}>Deletar</Button>
          </ListItem>
        ))}
      </List>
      
      <Box display="flex" justifyContent="flex-start" marginTop={4}>
        <Button variant="contained" color="primary" onClick={() => router.push('/register')}>
          Registrar Novo Profissional
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Editar Profissional</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            type="text"
            fullWidth
            value={editingProfessional?.name || ''}
            onChange={(e) => setEditingProfessional({ ...editingProfessional, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={editingProfessional?.email || ''}
            onChange={(e) => setEditingProfessional({ ...editingProfessional, email: e.target.value })}
          />
          <Typography variant="h6" style={{ marginTop: '20px' }}>Qualificações</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" marginY={2}>
            {editingProfessional?.qualifications.map((qual, index) => (
              <Chip
                key={index}
                label={qual}
                onDelete={() => handleRemoveQualification(index)}
              />
            ))}
          </Stack>
          <Box display="flex" alignItems="center">
            <TextField
              fullWidth
              label="Nova Qualificação"
              value={newQualification}
              onChange={(e) => setNewQualification(e.target.value)}
            />
            <Button onClick={handleAddQualification}>Adicionar</Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={() => handleUpdate(editingProfessional.id, editingProfessional)}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ListPage;