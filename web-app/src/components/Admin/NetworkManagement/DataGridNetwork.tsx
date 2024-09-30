"use client";
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridSlots, GridToolbar } from '@mui/x-data-grid';
import SettingsModal from '@/components/Admin/NetworkManagement/SettingsModal';
import EditNetworkToolbar from '@/components/Admin/NetworkManagement/EditNetworkToolbar';
import NetworkDetailsOverlay from '@/components/Admin/NetworkManagement/NetworkDetailsOverlay';

export default function DataGridNetwork({network_data}: any) {
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

  const handleRowSelection = (selection: any) => {
    const selectedId = selection[0];
    const detail = network_data.find((data: any) => data.id === selectedId);
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
      <Typography variant="h4" component="h1" className="text-primary">
        Networks
      </Typography>
      <Typography variant="subtitle1" component="p" color="textSecondary">
        Managing Network.
      </Typography>
      <Box sx={{ height: 700, width: '100%', position: 'relative', mt: 2 }}>
        <DataGrid
          loading={network_data?.length == 0}
          rows={network_data}
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
            loadingOverlay: {
              variant: 'linear-progress',
              noRowsVariant: 'linear-progress',
            },
            toolbar: { selected, setOpenSettingModal },
          }}
        />
        <NetworkDetailsOverlay
          isOverlayVisible={isOverlayVisible}
          selectedDetail={selectedDetail}
          isMaximized={isMaximized}
          handleToggleMaximize={handleToggleMaximize}
          handleCloseOverlay={handleCloseOverlay}
        />
      </Box>
      <SettingsModal selectedDetail={selectedDetail} openSettingModal={openSettingModal} setOpenSettingModal={setOpenSettingModal} />
    </div>
  );
}
