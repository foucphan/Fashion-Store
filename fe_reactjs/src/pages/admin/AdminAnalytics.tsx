import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const AdminAnalytics: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Thống kê
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
        <Typography>Thống kê và báo cáo sẽ được hiển thị ở đây</Typography>
      </Paper>
    </Box>
  );
};

