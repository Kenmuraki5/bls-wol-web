'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const DeviceStatus = ({ status }:any) => {

  return (
    <IconButton
      color={status == "online" ? 'success' : 'error'}
      title={status == "online" ? 'Online' : 'Offline'}
      sx={{ ml: 1 }}
    >
      {status == "online" ? <CheckCircle /> : <Cancel />}
    </IconButton>
  );
};

export default DeviceStatus;
