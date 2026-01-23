import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { useTransactionByDateRange } from '../../hooks/useTransaction';

const TransactionSearch = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState(false);
  const [searchParams, setSearchParams] = useState({ start: '', end: '' });

  const { data: transactions, isLoading, error } = useTransactionByDateRange(
    search ? searchParams.start : null,
    search ? searchParams.end : null
  );

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      alert('Please fill in both date fields');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date must be before end date');
      return;
    }

    setSearchParams({ start: startDate, end: endDate });
    setSearch(true);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSearch(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
        Search by Date
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          fullWidth
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleSearch}
          sx={{ flex: 1 }}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={handleReset}
          sx={{ flex: 1 }}
        >
          Reset
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 1, fontSize: '0.85rem' }}>
          Error: {error.message}
        </Alert>
      )}

      {isLoading && search && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {search && !isLoading && transactions?.transactions && transactions.transactions.length > 0 && (
        <Box sx={{ mt: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
            Found: {transactions.transactions.length} transaction(s)
          </Typography>
        </Box>
      )}

      {search && !isLoading && (!transactions?.transactions || transactions.transactions.length === 0) && (
        <Alert severity="info" sx={{ mt: 1, fontSize: '0.85rem' }}>
          No transactions found
        </Alert>
      )}
    </Box>
  );
};

export default TransactionSearch;
