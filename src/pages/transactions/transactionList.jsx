import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2, Search } from 'lucide-react'
import { useTransactionList, useDeleteTransaction, formatDate } from "../../hooks/useTransaction"
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment // Add this import
} from '@mui/material';

const TransactionList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: transactionList, isLoading, error } = useTransactionList();
  const deleteTransactions = useDeleteTransaction();

  const handleDelete = (transactionId) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransactions.mutate(transactionId);
    }
  };

  let amountTransaction = transactionList?.data?.data || transactionList?.data?.transactions || transactionList?.data
  let filteredTransaction = []

  if(amountTransaction && Array.isArray(amountTransaction)) {
      filteredTransaction = amountTransaction.filter(item => {
        const cpfMatch = item?.ID_user?.toString().includes(searchTerm)
        const descMatch = item?.desc_transaction?.toLowerCase().includes(searchTerm.toLowerCase())
        const userMatch = item?.id_user_transaction?.toString().includes(searchTerm)
        
        return cpfMatch || descMatch || userMatch
      })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Typography color="error" variant="h6">
          Error loading transactions: {error.message}
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Transaction Management
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search transaction..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>CPF</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredTransaction.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.ID_user || '-'}</TableCell>
                <TableCell>{tx.date_transaction ? formatDate(tx.date_transaction) : '-'}</TableCell>
                <TableCell>{tx.desc_transaction || '-'}</TableCell>
                <TableCell>{tx.id_user_transaction || '-'}</TableCell>
                <TableCell>{tx.value || '-'}</TableCell>
                <TableCell>{tx.value_in_points || '-'}</TableCell>
                <TableCell>{tx.status || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="primary" 
                    component={Link} 
                    to={`/transaction/update/${tx.id}`}
                  >
                    <Edit size={20} />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => handleDelete(tx.id)}
                  >
                    <Trash2 size={20} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default TransactionList