import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
// import { useLocation } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/layout';



import './App.css'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);

  // const location = useLocation();

  React.useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("auth"));
  }, [location]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;  
  }

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
            <Route path="/news" element={<Layout><NewsList /></Layout>} />
            <Route path="/news/create" element={<Layout><NewsCreate /></Layout>} />
            <Route path="/news/edit/:id" element={<Layout><NewsEdit /></Layout>} />
            <Route path="/category" element={<Layout><CategoryList /></Layout>} />
            <Route path="/category/edit/:id" element={<Layout><CategoryEdit /></Layout>} />
            <Route path="/category/add-category" element={<Layout><CategoryCreate /></Layout>} />
            <Route path="/user" element={<Layout><UserList /></Layout>} />
            <Route path="/user/create" element={<Layout><UserCreate /></Layout>} />
            <Route path="/user/edit/:id" element={<Layout><UserEdit /></Layout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

      </Routes>
    </ThemeProvider>
  );
}



// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

export default App
