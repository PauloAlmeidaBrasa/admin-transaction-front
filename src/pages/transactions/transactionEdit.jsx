import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Update as UpdateIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useTransactionById, useUpdateTransaction } from '../../hooks/useTransaction';


const TransactionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: transaction, isLoading, error } = useTransactionById(id);

  const [formData, setFormData] = useState({
    ID_user: '',
    date_transaction: '',
    desc_transaction: '',
    id_user_transaction: '',
    value: 'draft',
    value_in_points: '',
    status: '',
  });


  // Update form when data is loaded
  useEffect(() => {
    const txData = transaction?.data?.transaction;
    
    if (txData) {
      setFormData({
        ID_user: txData.ID_user || '',
        date_transaction: txData.date_transaction || '',
        desc_transaction: txData.desc_transaction || '',
        id_user_transaction: txData.id_user_transaction || '',
        value: txData.value || '',
        value_in_points: txData.value_in_points || '',
        status: txData.status || '',
      });
    }
  }, [transaction]);

  const transactionUpdate = useUpdateTransaction({
    onSuccess: () => {
      navigate('/transactions');
    },
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      created_at: formData.date_transaction || null,
      _method: 'PATCH'
    };

    transactionUpdate.mutate({
      id,
      payload: submitData,
    });

  };

  const handleBack = () => {
    navigate('/transactions');
  };

   const originalTransaction = transaction?.data?.transaction


  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading transaction article...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load transaction article: {error.message || String(error)}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to transaction
        </Button>
      </Container>
    );
  }

  if (!originalTransaction || !formData.ID_user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Transaction not found
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Transaction
        </Button>
      </Container>
    );
  }

 

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Transaction
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Edit Transaction
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Update the transaction details
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              label={`ID: ${id}`} 
              variant="outlined" 
              size="small" 
            />
            <Chip 
              label={originalTransaction.status} 
              color={originalTransaction.status === 'published' ? 'success' : 'default'}
              size="small" 
            />
          </Box>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.general}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Main Form */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box component="form" 
              // onSubmit={handleSubmit} 
              noValidate>
                <Grid container spacing={3}>
                  {/* Title */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="cpf do usuario"
                      name="ID_user"
                      value={formData.ID_user}
                      onChange={handleChange}
                      error={!!error}
                      helperText={error}
                      required
                      placeholder="Enter a compelling title for your news article"
                    />
                  </Grid>

                  {/* Date Transaction */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Date Transaction"
                      name="date_transaction"
                      type="datetime-local"
                      value={formData.date_transaction}
                      onChange={handleChange}
                      error={!!error}
                      helperText={error || "Transaction date"}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* Description */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="desc_transaction"
                      value={formData.desc_transaction}
                      onChange={handleChange}
                      error={!!error}
                      helperText={error || "Transaction description"}
                      multiline
                      rows={3}
                    />
                  </Grid>

                  {/* User ID */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="User Transaction ID"
                      name="id_user_transaction"
                      value={formData.id_user_transaction}
                      onChange={handleChange}
                      error={!!error}
                      helperText={error}
                    />
                  </Grid>

                  {/* Value */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Value"
                      name="value"
                      type="number"
                      value={formData.value}
                      onChange={handleChange}
                      error={!!error}
                      helperText={error}
                    />
                  </Grid>

                  {/* Value in Points */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Value in Points"
                      name="value_in_points"
                      type="number"
                      value={formData.value_in_points}
                      onChange={handleChange}
                      error={!!error}
                      helperText={error}
                    />
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar - Settings & Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Publication Settings
              </Typography>
              
              <Grid container spacing={3}>
                {/* Status */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    helperText="Choose whether to publish now or save as draft"
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                  </TextField>
                </Grid>

                {/* Publish Date */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="datetime"
                    label="Publish Date & Time"
                    name="created_at"
                    value={formData.created_at}
                    // value={formatDate(formData.published_at)}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    helperText="Schedule publication for a specific date and time"
                  />
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleSubmit}
                      disabled={isLoading}
                      startIcon={
                        isLoading ? 
                        <CircularProgress size={20} /> : 
                        <SaveIcon />
                      }
                    >
                      {isLoading ? 'Updating...' : 'Update Transaction'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      onClick={handleBack}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Article Information Card */}
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Article Information
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Created
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon fontSize="small" />
                    {originalTransaction?.created_at ? new Date(originalTransaction.created_at).toLocaleString() : 'N/A'}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Last Updated
                  </Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <UpdateIcon fontSize="small" />
                    {originalTransaction?.updated_at ? new Date(originalTransaction.updated_at).toLocaleString() : 'N/A'}
                  </Typography>
                </Box>

                {originalTransaction?.created_at && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Originally Published
                      </Typography>
                      <Typography variant="body2">
                        {new Date(originalTransaction.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Editing Tips
              </Typography>
              <Typography variant="body2" color="textSecondary" component="div">
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                  <li>Update the title if the focus has changed</li>
                  <li>Keep the excerpt concise and engaging</li>
                  <li>Review content for accuracy and clarity</li>
                  <li>Change status to control visibility</li>
                  <li>Update publication date for re-publishing</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TransactionEdit;