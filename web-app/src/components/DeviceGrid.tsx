'use client';

import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import { Computer } from '@mui/icons-material';
import { handleWake } from '@/lib/wake';
import DeviceStatus from './DeviceStatus/DeviceStatus';

const DeviceGrid = ({ userId }: any) => {
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;


    const eventSource = new EventSource(`http://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/events/1`);

    eventSource.onopen = () => {
      setLoading(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      const data= JSON.parse(event.data);
      if (data) {
        setDeviceData(data);
        setLoading(false);
      }
    };

    eventSource.onerror = () => {
      console.error('SSE error occurred');
      setError('Failed to connect to SSE. Please try again later.');
      setLoading(false);
    };

    // Cleanup EventSource connection on component unmount
    return () => {
      eventSource.close();
    };
  }, [userId]);

  return (
    <Box id="GridDevices" sx={{ mb: 6 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="h6" color="error" sx={{ textAlign: 'center' }}>
          {error}
        </Typography>
      ) : deviceData.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          No devices found for this user.
        </Typography>
      ) : (
        deviceData.map((device: any) => (
          <Box
            key={device.id}
            sx={{
              p: 4,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 1,
              mb: 2,
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Computer sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h6" component="h3" sx={{ mr: 2 }}>
                {device.name}
              </Typography>
              <DeviceStatus status={device.status} />
            </Box>
            <Typography variant="body1">
              <strong>MAC Address:</strong> {device.mac}
            </Typography>
            <Typography variant="body1">
              <strong>IP Address:</strong> {device.ip}
            </Typography>
            <Typography variant="body1">
              <strong>Port:</strong> {device.port}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleWake(device.id)}
              sx={{ mt: 2 }}
            >
              Wake Up
            </Button>
          </Box>
        ))
      )}
    </Box>
  );
};

export default DeviceGrid;
