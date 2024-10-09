import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const TestConnection = () => {
  const [result, setResult] = useState('');

  const testConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/test`);
      const data = await response.json();
      setResult(`Conexão bem-sucedida: ${data.message}`);
    } catch (error) {
      setResult(`Erro na conexão: ${error.message}`);
    }
  };

  return (
    <div>
      <Button onClick={testConnection} variant="contained" style={{ marginTop: '20px' }}>
        Testar Conexão
      </Button>
      <Typography style={{ marginTop: '10px' }}>{result}</Typography>
    </div>
  );
};

export default TestConnection;