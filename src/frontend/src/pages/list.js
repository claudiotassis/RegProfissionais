import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack
} from '@mui/material';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const ListPage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [editingProfessional, setEditingProfessional] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfessionals();
  }, []);

  useEffect(() => {
    filterAndSortProfessionals();
  }, [professionals, filterText, sortBy]);

  const fetchProfessionals = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching professionals from:', `${API_URL}/professionals`);
      const response = await fetch(`${API_URL}/professionals`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar profissionais');
      }
      const data = await response.json();
      console.log('Professionals data:', data);
      setProfessionals(data);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
      setError('Erro ao buscar profissionais: ' + error.message);
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
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/professionals/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
      setError('Erro ao atualizar profissional: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este profissional?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/professionals/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao deletar profissional');
        }
        fetchProfessionals();
      } catch (error) {
        console.error('Erro ao deletar:', error);
        setError('Erro ao deletar profissional: ' + error.message);
      }
    }
  };

  const handleEditClick = (professional) => {
    setEditingProfessional({ ...professional });
    setOpenDialog(true);
  };

  const handleAddQualification = () => {
    setEditingProfessional({
      ...editingProfessional,
      qualifications: [...editingProfessional.qualifications, '']
    });
  };

  const handleQualificationChange = (index, value) => {
    const updatedQualifications = [...editingProfessional.qualifications];
    updatedQualifications[index] = value;
    setEditingProfessional({
      ...editingProfessional,
      qualifications: updatedQualifications
    });
  };

  const handleRemoveQualification = (index) => {
    setEditingProfessional({
      ...editingProfessional,
      qualifications: editingProfessional.qualifications.filter((_, i) => i !== index)
    });
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Qualificações</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProfessionals.map((professional) => (
              <TableRow key={professional.id}>
                <TableCell>{professional.name}</TableCell>
                <TableCell>{professional.email}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {professional.qualifications.map((qual, index) => (
                      <Chip key={index} label={qual} size="small" />
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleEditClick(professional)}>Editar</Button>
                  <Button onClick={() => handleDelete(professional.id)}>Deletar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
          <Stack spacing={2}>
            {editingProfessional?.qualifications.map((qual, index) => (
              <Box key={index} display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label={`Qualificação ${index + 1}`}
                  value={qual}
                  onChange={(e) => handleQualificationChange(index, e.target.value)}
                />
                <Button onClick={() => handleRemoveQualification(index)} color="error">Remover</Button>
              </Box>
            ))}
          </Stack>
          <Button variant="contained" color="primary" onClick={handleAddQualification}>
            Adicionar Qualificação
          </Button>
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