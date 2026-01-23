import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2, Search } from 'lucide-react'
import { useTransactionListUser, useDeleteTransaction, formatDate, formatStatus } from "../../hooks/useTransaction"
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
  InputAdornment,
  Alert
} from '@mui/material';

const TransactionUserList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const deleteTransactions = useDeleteTransaction();

  // Get current user data
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser?.id;

  const { data: transactionList, isLoading, error } = useTransactionListUser(currentUserId);

  const handleDelete = (transactionId) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransactions.mutate(transactionId);
    }
  };

  let amountTransaction = transactionList?.data?.data || transactionList?.data?.transactions || transactionList?.data
  let filteredTransaction = []

  if(amountTransaction && Array.isArray(amountTransaction)) {
      // Filter transactions for current user only
      filteredTransaction = amountTransaction.filter(item => {
        const isCurrentUserTransaction = parseInt(item?.id_user_transaction) === currentUserId;
        
        const cpfMatch = item?.ID_user?.toString().includes(searchTerm)
        const descMatch = item?.desc_transaction?.toLowerCase().includes(searchTerm.toLowerCase())
        
        return isCurrentUserTransaction && (cpfMatch || descMatch)
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
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading transactions: {error.message}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        My Transactions
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Viewing transactions for user ID: {currentUserId}
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
              <TableCell>Value</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Status</TableCell>
              {/* <TableCell align="right">Actions</TableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredTransaction.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{tx.ID_user || '-'}</TableCell>
                <TableCell>{tx.date_transaction ? formatDate(tx.date_transaction) : '-'}</TableCell>
                <TableCell>{tx.desc_transaction || '-'}</TableCell>
                <TableCell>{tx.value || '-'}</TableCell>
                <TableCell>{tx.value_in_points || '-'}</TableCell>
                <TableCell>{tx.status ? formatStatus(tx.status) : '-'}</TableCell>
                {/* <TableCell align="right">
                  <IconButton 
                    color="primary" 
                    component={Link} 
                    to={`/transaction/update/${tx.id}`}
                    size="small"
                  >
                    <Edit size={20} />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => handleDelete(tx.id)}
                    size="small"
                  >
                    <Trash2 size={20} />
                  </IconButton>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredTransaction.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'textSecondary' }}>
          No transactions found.
        </Box>
      )}
    </Container>
  )
}

export default TransactionUserList
