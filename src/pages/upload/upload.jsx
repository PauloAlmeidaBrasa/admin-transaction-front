import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { adminAPITransaction } from '../../services/api/api-admin';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
        setUploadStatus({
          type: 'error',
          message: 'Please select a valid Excel file (.xlsx, .xls, or .csv)',
        });
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({
        type: 'error',
        message: 'Please select a file to upload',
      });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const response = await adminAPITransaction.upload(file);
      
      setUploadStatus({
        type: 'success',
        message: `Successfully uploaded ${file.name}`,
      });
      
      setUploadResult(response.data?.data);
      setFile(null);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFile(null);
        setUploadStatus(null);
      }, 3000);
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to upload file',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload Transactions
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Upload an Excel file to import transactions in bulk
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              border: '2px dashed',
              borderColor: file ? 'success.main' : 'divider',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              backgroundColor: file ? 'success.light' : 'background.paper',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
              },
            }}
            component="label"
          >
            <input
              hidden
              accept=".xlsx,.xls,.csv"
              type="file"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {file ? file.name : 'Drag and drop your Excel file here'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              or click to select a file (.xlsx, .xls, .csv)
            </Typography>
            {file && (
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Size: {(file.size / 1024).toFixed(2)} KB
              </Typography>
            )}
          </Box>

          {uploadStatus && (
            <Alert
              severity={uploadStatus.type}
              sx={{ mt: 3 }}
              icon={
                uploadStatus.type === 'success' ? (
                  <CheckCircleIcon />
                ) : (
                  <ErrorIcon />
                )
              }
            >
              {uploadStatus.message}
            </Alert>
          )}

          {uploading && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Uploading file...
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleUpload}
              disabled={!file || uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </Button>
            {file && (
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  setFile(null);
                  setUploadStatus(null);
                }}
                disabled={uploading}
              >
                Clear
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {uploadResult && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upload Summary
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Metric</TableCell>
                    <TableCell align="right">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Rows Processed</TableCell>
                    <TableCell align="right">
                      {uploadResult.total_rows || 0}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Successful Imports</TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>
                      {uploadResult.success_count || 0}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Failed Imports</TableCell>
                    <TableCell align="right" sx={{ color: 'error.main' }}>
                      {uploadResult.error_count || 0}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {uploadResult.errors && uploadResult.errors.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="error" gutterBottom>
                  Errors:
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Row</TableCell>
                        <TableCell>Error Message</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {uploadResult.errors.map((error, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{error.row}</TableCell>
                          <TableCell>{error.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Upload;
