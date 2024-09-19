'use client'
import React, { useState, useMemo } from 'react';
import { Box, Typography, Card, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WifiIcon from '@mui/icons-material/Wifi';
import { DataGrid } from '@mui/x-data-grid';

const ActivityLogs = ({ data_wakeLogs }: any) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = useMemo(() => {
    if (!searchTerm) return data_wakeLogs;

    return data_wakeLogs.filter((log: any) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        log.computer.name.toLowerCase().includes(searchLower) ||
        log.computer.ip.toLowerCase().includes(searchLower) ||
        log.computer.status.toLowerCase().includes(searchLower) ||
        log.status.toLowerCase().includes(searchLower) ||
        new Date(log.created_at).toLocaleString().toLowerCase().includes(searchLower)
      );
    });
  }, [searchTerm, data_wakeLogs]);

  const getIconColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'green';
      case 'failed':
        return 'red';
      default:
        return 'grey'; // Default color if status is unknown
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'computer_name', headerName: 'Computer Name', width: 150 },
    { field: 'computer_ip', headerName: 'IP Address', width: 150 },
    { field: 'computer_status', headerName: 'Computer Status', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params:any) => {
        const color = getIconColor(params.value);
        return (
          <Box display="flex" alignItems="center">
            <WifiIcon style={{ marginRight: 4, color: color }} />
            <Typography variant="body2">{params.value}</Typography>
          </Box>
        );
      },
    },
    { field: 'created_at', headerName: 'Created At', width: 200 },
  ];

  const rows = filteredRows.map((log: any) => ({
    id: log.id,
    computer_name: log.computer.name,
    computer_ip: log.computer.ip,
    computer_status: log.computer.status,
    status: log.status,
    created_at: new Date(log.created_at).toLocaleString(), // Format date as needed
  }));

  return (
    <Box className="mt-8">
      <Typography variant="h5" className="mb-4">
        Recent Activity Logs
      </Typography>

      <Card className="shadow-sm p-4 bg-slate-50">
        {/* Search Bar with Icon */}
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {rows.length > 0 ? (
          <div style={{ height: 400, width: '100%', backgroundColor: 'white' }}>
            <DataGrid rows={rows} columns={columns} />
          </div>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No recent activity yet.
          </Typography>
        )}
      </Card>
    </Box>
  );
};

export default ActivityLogs;
