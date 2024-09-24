import React from 'react';
import { Box, Grid, Typography, IconButton } from '@mui/material';
import { Minimize, Fullscreen, Close, ContentCopy } from '@mui/icons-material';

const DeviceDetailsOverlay = ({
  isOverlayVisible,
  selectedDetail,
  isMaximized,
  handleToggleMaximize,
  handleCloseOverlay,
}: any) => {
  if (!isOverlayVisible || !selectedDetail) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: isMaximized ? '100%' : { xs: '70%', md: '400px' },
        backgroundColor: 'white',
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
          sx={{ color: 'black', pr: { xs: 2, md: 10 }, fontWeight: 'bold' }}
        >
          Device: {selectedDetail?.id}
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: 'black', pr: { xs: 2, md: 5 }, fontWeight: 'bold' }}
        >
          Mac Address: {selectedDetail?.mac}
        </Typography>
      </Box>

      {/* Grid Layout for Device Details */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {[
            { label: 'ID', value: selectedDetail?.id },
            { label: 'Name', value: selectedDetail?.name },
            { label: 'IP Address', value: selectedDetail?.ip },
            { label: 'MAC Address', value: selectedDetail?.mac },
            { label: 'Port', value: selectedDetail?.port },
          ].map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'black' }}>
                {item.label}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 1, color: 'black' }}>
                  {item.value}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => navigator.clipboard.writeText(item.value)}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Grid>
        <Grid item xs={12} md={6}>
          {[
            { label: 'Network Name', value: selectedDetail?.network?.name },
            { label: 'Network Address', value: selectedDetail?.network?.network_address },
            { label: 'Subnet Mask', value: selectedDetail?.network?.subnet_mask },
            { label: 'Broadcast Address', value: selectedDetail?.network?.broadcast_address },
            {
              label: 'Status',
              value: selectedDetail?.status === 'online' ? 'Online' : 'Offline',
            },
          ].map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'black' }}>
                {item.label}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 1, color: 'black' }}>
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

export default DeviceDetailsOverlay;
