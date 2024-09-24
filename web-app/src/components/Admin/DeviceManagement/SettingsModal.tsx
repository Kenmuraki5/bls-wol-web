import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Divider, Grid, TextField, FormHelperText, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const SettingsModal = ({ setOpenSettingModal, openSettingModal, selectedDetail }: any) => {
    const [deviceName, setDeviceName] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [macAddress, setMacAddress] = useState('');
    const [port, setPort] = useState('');

    useEffect(() => {
        if (openSettingModal && selectedDetail) {
            setDeviceName(selectedDetail.name || '');
            setIpAddress(selectedDetail.ip || '');
            setMacAddress(selectedDetail.mac || '');
            setPort(selectedDetail.port || '');
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
                                label="Device Name"
                                variant="standard"
                                fullWidth
                                value={deviceName}
                                onChange={(e) => setDeviceName(e.target.value)}
                            />
                            <FormHelperText className='mb-4'>
                                Name of the device.
                            </FormHelperText>

                            <TextField
                                label="IP Address"
                                variant="standard"
                                fullWidth
                                value={ipAddress}
                                onChange={(e) => setIpAddress(e.target.value)}
                            />
                            <FormHelperText className='mb-4'>
                                The IP address of the network interface card.
                            </FormHelperText>

                            <TextField
                                label="MAC Address"
                                variant="standard"
                                fullWidth
                                value={macAddress}
                                onChange={(e) => setMacAddress(e.target.value)}
                            />
                            <FormHelperText className='mb-4'>
                                The MAC address of the target computer. This can be found in the network interface card settings on your computer.
                            </FormHelperText>

                            <TextField
                                label="Port"
                                variant="standard"
                                fullWidth
                                value={port}
                                onChange={(e) => setPort(e.target.value)}
                            />
                            <FormHelperText className='mb-4'>
                                The wake-on-LAN port. Usually, port 9 is supported by most ethernet cards, but you can also try 7 or 0.
                            </FormHelperText>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
};

export default SettingsModal;
