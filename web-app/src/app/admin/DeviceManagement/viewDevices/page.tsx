'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { DataGrid, GridSlots } from '@mui/x-data-grid';
import WifiIcon from '@mui/icons-material/Wifi';
import SettingsModal from '@/components/Admin/DeviceManagement/SettingsModal';
import EditDeviceToolbar from '@/components/Admin/DeviceManagement/EditDeviceToolbar';
import DeviceDetailsOverlay from '@/components/Admin/DeviceManagement/DeviceDetailsOverlay';

const ViewDevicesPage = () => {
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const [selected, setSelectedAction] = useState<any | null>(null);

  const [openSettingModal, setOpenSettingModal] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(`http://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/admin/devices`);
    eventSource.onopen = () => setLoading(true);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data) {
        setDeviceData(data);
        setLoading(false);
      }
    };
    eventSource.onerror = () => {
      console.error('SSE error');
      setLoading(false);
    };
    return () => eventSource.close();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'ip', headerName: 'IP Address', width: 150 },
    { field: 'mac', headerName: 'MAC Address', width: 200 },
    { field: 'port', headerName: 'Port', width: 80 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params: any) => (
        <Box>
          <WifiIcon sx={{ color: params.value === 'online' ? 'green' : 'red', fontWeight: 'bold' }} />
          {params.value === 'online' ? 'Online' : 'Offline'}
        </Box>
      ),
    },
  ];

  const handleRowSelection = (selection: any) => {
    const selectedId = selection[0];
    const detail = deviceData.find((device) => device.id === selectedId);
    setSelectedDetail(detail);
    setOverlayVisible(true);
    setSelectedAction(selection)
  };

  const handleCloseOverlay = () => {
    setOverlayVisible(false);
  };

  const handleToggleMaximize = () => {
    setIsMaximized((prevState) => !prevState);
  };


  return (
    <Box className='overflow-hidden'>
      <Typography variant="h4" component="h1" className="text-primary">
        Wake-on-lan Devices
      </Typography>
      <Typography variant="subtitle1" component="p" color="textSecondary">
        Monitor the status and manage Devices in your organization.
      </Typography>
      <Box sx={{ height: 700, width: '100%', position: 'relative', mt: 2 }}>
        <DataGrid
          loading={loading}
          rows={deviceData}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(newSelection: any) => {
            handleRowSelection(newSelection);
          }}
          slots={{
            toolbar: EditDeviceToolbar as GridSlots['toolbar'],
          }}
          slotProps={{
            loadingOverlay: {
              variant: 'linear-progress',
              noRowsVariant: 'linear-progress',
            },
            toolbar: { selected, setOpenSettingModal },
          }}
        />

        {/* Overlay box */}
        <DeviceDetailsOverlay
          isOverlayVisible={isOverlayVisible}
          selectedDetail={selectedDetail}
          isMaximized={isMaximized}
          handleToggleMaximize={handleToggleMaximize}
          handleCloseOverlay={handleCloseOverlay}
        />
      </Box>
      <SettingsModal selectedDetail={selectedDetail} openSettingModal={openSettingModal} setOpenSettingModal={setOpenSettingModal} />
    </Box>
  );
};

export default ViewDevicesPage;
