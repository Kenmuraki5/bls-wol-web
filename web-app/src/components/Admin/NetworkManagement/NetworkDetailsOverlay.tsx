import React from 'react';
import { Box, Grid, Typography, IconButton, useTheme } from '@mui/material';
import { Minimize, Fullscreen, Close, ContentCopy } from '@mui/icons-material';

const NetworkDetailsOverlay = ({
  isOverlayVisible,
  selectedDetail,
  isMaximized,
  handleToggleMaximize,
  handleCloseOverlay,
}: any) => {
  const theme = useTheme(); // เข้าถึงธีม\\\
  if (!isOverlayVisible || !selectedDetail) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: isMaximized ? '100%' : { xs: '70%', md: '400px' },
        backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#fff', // สีพื้นหลังตามธีม
        border: '1px solid #ccc',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 10,
        p: 3,
        overflowY: 'auto',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      {/* Control Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <IconButton onClick={handleToggleMaximize}>
          {isMaximized ? <Minimize /> : <Fullscreen />}
        </IconButton>
        <IconButton onClick={handleCloseOverlay}>
          <Close />
        </IconButton>
      </Box>

      {/* Device Details Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ pr: { xs: 2, md: 10 }, fontWeight: 'bold' }}
        >
          Network ID: {selectedDetail?.network_id}
        </Typography>
      </Box>

      {/* Grid Layout for Device Details */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {[
            { label: 'Network Name', value: selectedDetail?.name },
            { label: 'Network Address', value: selectedDetail?.network_address },
            { label: 'Subnet Mask', value: selectedDetail?.subnet_mask },
            { label: 'Broadcast Address', value: selectedDetail?.broadcast_address },
            {
              label: 'Status',
              value: selectedDetail?.status === 'online' ? 'Online' : 'Offline',
            },
          ].map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body2">
                {item.label}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 1 }}>
                  {item.label !== 'Status' && item.value}
                  {item.label === 'Status' && (
                    <Box sx={{ color: item.value.toLowerCase() === 'online' ? 'green' : 'red' }}>
                      {item.value.toLowerCase() === 'online' ? '● Online' : '● Offline'}
                    </Box>
                  )}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => navigator.clipboard.writeText(item.value)}
                >
                  {item.value && item.label !== 'Status' && <ContentCopy fontSize="small" />}
                </IconButton>
              </Box>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default NetworkDetailsOverlay;
