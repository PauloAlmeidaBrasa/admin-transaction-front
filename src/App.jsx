// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dashboard from './pages/dashboard';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/layout';
import Login from './pages/login/login';
import TransactionList from './pages/transactions/transactionList'
import TransactionEdit from './pages/transactions/transactionEdit';
import Upload from './pages/upload/upload';



import './App.css'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem("auth"));

  React.useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem("auth"));
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>

        {!isAuthenticated && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
        {isAuthenticated && (
          <>
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/transactions" element={<Layout><TransactionList /></Layout>} />
            <Route path="/upload" element={<Layout><Upload /></Layout>} />
            {/* <Route path="/news/create" element={<Layout><NewsCreate /></Layout>} /> */}
            <Route path="/transaction/update/:id" element={<Layout><TransactionEdit /></Layout>} />
            <Route path="*" element={<Navigate to="/transactions" replace />} />
          </>
        )}

      </Routes>
    </ThemeProvider>
  );
}

export default App
