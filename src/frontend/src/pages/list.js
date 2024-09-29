// src/frontend/src/pages/list.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/router';
import ProfessionalsList from '../components/ProfessionalsList';

const ListPage = () => {
  const [professionals, setProfessionals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const response = await fetch('http://localhost:3001/professionals'); // Fetch da lista de profissionais do backend
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

  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:3001/professionals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData), // Envia os dados atualizados para o backend
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Captura a mensagem de erro do backend
        throw new Error(errorData.error || 'Erro ao atualizar profissional');
      }
  
      fetchProfessionals(); // Atualiza a lista após a edição
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar profissional: ' + error.message);
    }
  };
  
  
  

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Tem certeza que deseja deletar este profissional?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3001/professionals/${id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          const errorData = await response.json(); // Captura a mensagem de erro do backend
          throw new Error(errorData.error || 'Erro ao deletar profissional');
        }
  
        fetchProfessionals(); // Atualiza a lista após a exclusão
      } catch (error) {
        console.error('Erro ao deletar:', error);
        alert('Erro ao deletar profissional: ' + error.message);
      }
    }
  };
  
  
  

  return (
    <Container>
      <Typography variant="h4" marginBottom={4}>Lista de Profissionais</Typography>
      <ProfessionalsList
        professionals={professionals}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
      <Box marginTop={4}>
        <Button variant="outlined" color="secondary" onClick={() => router.push('/')}>
          Voltar à página principal
        </Button>
      </Box>
    </Container>
  );
};

export default ListPage;
