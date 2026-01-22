import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  Article as ArticleIcon,
  TrendingUp as TrendingIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { newsAPI } from '../services/api/api-admin';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
        </Box>
        <Box sx={{ color: color, fontSize: 54 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { data: news, isLoading } = useQuery({ 
    queryKey: ['news'], 
    queryFn: () => newsAPI.getAll() 
  });

  const stats = [
    {
      title: 'Total News',
      value: news?.data?.length || 0,
      icon: <ArticleIcon fontSize="inherit" />,
      color: '#1976d2',
    },
    {
      title: 'Published',
      value: news?.data?.filter(item => item.status === 'published').length || 0,
      icon: <TrendingIcon fontSize="inherit" />,
      color: '#2e7d32',
    },
    {
      title: 'Drafts',
      value: news?.data?.filter(item => item.status === 'draft').length || 0,
      icon: <PeopleIcon fontSize="inherit" />,
      color: '#ed6c02',
    },
  ];

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;