"use client";
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridSlots, GridToolbar } from '@mui/x-data-grid';
import SettingsModal from '@/components/Admin/NetworkManagement/SettingsModal';
import EditNetworkToolbar from '@/components/Admin/NetworkManagement/EditNetworkToolbar';
import NetworkDetailsOverlay from '@/components/Admin/NetworkManagement/NetworkDetailsOverlay';

export default function Page() {
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const [selected, setSelectedAction] = useState<any | null>(null);

  const [openSettingModal, setOpenSettingModal] = useState(false);

  const columns = [
    { field: 'network_id', headerName: 'Network ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'network_address', headerName: 'Network Address', width: 150 },
    { field: 'subnet_mask', headerName: 'Subnet Mask', width: 200 },
    { field: 'broadcast_address', headerName: 'Broadcast Address', width: 150 }
  ];
  

  const fetchDeviceData = async () => {
    // Mock data for demonstration
    const mockData = [
      { id: 1, network_id: 'net-001', name: 'Network 1', network_address: '192.168.1.0', subnet_mask: '255.255.255.0', broadcast_address: '192.168.1.255' },
      { id: 2, network_id: 'net-002', name: 'Network 2', network_address: '192.168.2.0', subnet_mask: '255.255.255.0', broadcast_address: '192.168.2.255' },
      { id: 3, network_id: 'net-003', name: 'Network 3', network_address: '192.168.3.0', subnet_mask: '255.255.255.0', broadcast_address: '192.168.3.255' },
      { id: 4, network_id: 'net-004', name: 'Network 4', network_address: '192.168.4.0', subnet_mask: '255.255.255.0', broadcast_address: '192.168.4.255' },
      { id: 5, network_id: 'net-005', name: 'Network 5', network_address: '192.168.5.0', subnet_mask: '255.255.255.0', broadcast_address: '192.168.5.255' },
    ];

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setDeviceData(mockData);
    setLoading(false);
  };

  useEffect(() => {
    fetchDeviceData();
  }, []);

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
    <div className='overflow-hidden'>
      <Typography variant="h4" component="h1" className="text-primary" color="black">
        Networks
      </Typography>
      <Typography variant="subtitle1" component="p" color="textSecondary">
        Managing Network.
      </Typography>
      <Box sx={{ height: 700, width: '100%', position: 'relative', mt: 2 }}>
        {loading ? (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={deviceData}
            columns={columns}
            pageSizeOptions={[10, 20, 30]}
            checkboxSelection
            onRowSelectionModelChange={(newSelection: any) => {
              handleRowSelection(newSelection);
            }}
            slots={{
              toolbar: EditNetworkToolbar as GridSlots['toolbar'],
            }}
            slotProps={{
              toolbar: { selected, setOpenSettingModal },
            }}
            sx={{
              backgroundColor: '#ffffff',
              '& .MuiDataGrid-row': {
                backgroundColor: '#fafafa',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f0f0f0',
              },
              '& .MuiDataGrid-cell': {
                padding: '10px',
              },
            }}
          />
        )}
        <NetworkDetailsOverlay
          isOverlayVisible={isOverlayVisible}
          selectedDetail={selectedDetail}
          isMaximized={isMaximized}
          handleToggleMaximize={handleToggleMaximize}
          handleCloseOverlay={handleCloseOverlay}
        />
      </Box>
      <SettingsModal selectedDetail={selectedDetail} openSettingModal={openSettingModal} setOpenSettingModal={setOpenSettingModal}/>
    </div>
  );
}
