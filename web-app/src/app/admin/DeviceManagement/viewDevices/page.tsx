'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Grid,
  useMediaQuery,
  Button,
} from '@mui/material';
import { DataGrid, GridRowModesModel, GridRowsProp, GridSlots, GridToolbarContainer } from '@mui/x-data-grid';
import {
  Close,
  Minimize,
  Fullscreen,
  ContentCopy,
  Menu as MenuIcon,
} from '@mui/icons-material';
import WifiIcon from '@mui/icons-material/Wifi';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsIcon from '@mui/icons-material/Settings';
import { handleWakeMoreDevice } from '@/lib/wake';
import SettingsModal from '@/components/Admin/DeviceManagement/SettingsModal';

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { selected, setOpenSettingModal }: any = props;
  const handleWakeUpClick = async () => {
    try {
      await handleWakeMoreDevice({ "ids": selected });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  const handleSettingsClick = () => {
    setOpenSettingModal(true)
  };

  return (
    <GridToolbarContainer>
      <Button color="info" startIcon={<PowerSettingsNewIcon />} onClick={handleWakeUpClick}>
        Wake Up Now
      </Button>
      <Button color="info" startIcon={<SettingsIcon />} onClick={handleSettingsClick}>
        Settings
      </Button>
    </GridToolbarContainer>
  );
}

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
    <div className='overflow-hidden'>
      <Typography variant="h4" component="h1" className="text-primary" color="black">
        Wake-on-lan Devices
      </Typography>
      <Typography variant="subtitle1" component="p" color="textSecondary">
        Monitor the status and manage Devices in your organization.
      </Typography>
      <Box sx={{ height: 700, width: '100%', position: 'relative', mt: 2 }}>
        {loading && (
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
        )}
        <DataGrid
          rows={deviceData}
          columns={columns}
          pageSizeOptions={[10, 20, 30]}
          checkboxSelection
          onRowSelectionModelChange={(newSelection: any) => {
            handleRowSelection(newSelection);
          }}
          slots={{
            toolbar: EditToolbar as GridSlots['toolbar'],
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

        {/* Overlay box */}
        {isOverlayVisible && selectedDetail && (
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
        )}
      </Box>
      <SettingsModal selectedDetail={selectedDetail} openSettingModal={openSettingModal} setOpenSettingModal={setOpenSettingModal}/>
    </div>
  );
};

export default ViewDevicesPage;
