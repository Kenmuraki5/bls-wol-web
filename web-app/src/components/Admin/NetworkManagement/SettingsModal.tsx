import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Divider, Grid, TextField, FormHelperText } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

export default function SettingsModal({ setOpenSettingModal, openSettingModal, selectedDetail }: any) {
  const [networkId, setNetworkId] = useState('');
  const [name, setNetworkName] = useState('');
  const [networkAddress, setNetworkAddress] = useState('');
  const [subnet_mask, setSubnetmask] = useState('');
  const [broadcast_address, setBroadcastAddress] = useState('');

  useEffect(() => {
    if (openSettingModal && selectedDetail) {
      setNetworkId(selectedDetail.network_id || '');
      setNetworkName(selectedDetail.name || '');
      setNetworkAddress(selectedDetail.network_address || '');
      setSubnetmask(selectedDetail.subnet_mask || '');
      setBroadcastAddress(selectedDetail.broadcast_address || '')

    }
    console.log(selectedDetail)
  }, [openSettingModal, selectedDetail]);

  const handleClose = () => setOpenSettingModal(false);

  return (
    <div>
      {/* Modal component */}
      <Modal
        open={openSettingModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          invisible: true,
        }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 10 }}
      >
        <Box
          className="bg-white p-6 shadow-lg"
          sx={{
            width: '100%',
            maxWidth: '600px',
            height: 'calc(100vh - 64px)',
            overflowY: 'auto',
            position: 'fixed',
            top: 64,
            right: 0,
          }}
        >
          <Box className="flex items-center justify-between mb-4 text-black">
            <Box sx={{ alignItems: 'center' }}>
              <Typography>
                SETTING
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<SaveOutlinedIcon />}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
            </Box>
            <Box>
              <Button
                color='error'
                variant="outlined"
                startIcon={<DeleteOutlineOutlinedIcon />}
              >
                Delete
              </Button>
            </Box>
          </Box>
          <Divider className="mb-4" />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Network Name"
                variant="standard"
                fullWidth
                value={name}
                onChange={(e) => setNetworkName(e.target.value)}
              />
              <FormHelperText className='mb-4'>
                Name of the Network.
              </FormHelperText>

              <TextField
                label="Network Address"
                variant="standard"
                fullWidth
                value={networkAddress}
                onChange={(e) => setNetworkAddress(e.target.value)}
              />
              <FormHelperText className='mb-4'>
                The IP address of the network interface card (NIC).
              </FormHelperText>

              <TextField
                label="Subnet Mask"
                variant="standard"
                fullWidth
                value={subnet_mask}
                onChange={(e) => setSubnetmask(e.target.value)}
              />
              <FormHelperText className='mb-4'>
                The subnet mask defines the network's address range.
              </FormHelperText>


              <TextField
                label="Broadcast Address"
                variant="standard"
                fullWidth
                value={broadcast_address}
                onChange={(e) => setBroadcastAddress(e.target.value)}
              />
              <FormHelperText className='mb-4'>
                The broadcast address is used to send data to all devices within the network.
              </FormHelperText>

            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  )
}
