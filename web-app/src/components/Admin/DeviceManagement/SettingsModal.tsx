import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, Divider, Grid, TextField, FormHelperText } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

// Utility function to convert IP to numeric
const ipToNumber = (ip: string) => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
};

// Check if IP is within range
const isIpInRange = (ip: string, startIp: string, endIp: string) => {
    const ipNum = ipToNumber(ip);
    const startIpNum = ipToNumber(startIp);
    const endIpNum = ipToNumber(endIp);
    return ipNum >= startIpNum && ipNum <= endIpNum;
};

// Validate IP format (simple check)
const isValidIp = (ip: string) => {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
};

const SettingsModal = ({ setOpenSettingModal, openSettingModal, selectedDetail }: any) => {
    const [deviceName, setDeviceName] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [macAddress, setMacAddress] = useState('');
    const [port, setPort] = useState('');
    const [ipError, setIpError] = useState('');

    useEffect(() => {
        if (openSettingModal && selectedDetail) {
            setDeviceName(selectedDetail.name || '');
            setIpAddress(selectedDetail.ip || '');
            setMacAddress(selectedDetail.mac || '');
            setPort(selectedDetail.port || '');
        }
    }, [openSettingModal, selectedDetail]);

    const handleClose = () => setOpenSettingModal(false);

    // Real-time validation for IP address
    const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setIpAddress(value);

        // Check if IP is valid
        if (!isValidIp(value)) {
            setIpError('Invalid IP format.');
            return;
        }

        // Check if IP is within range
        const isValid = isIpInRange(value, selectedDetail.network.network_address, selectedDetail.network.broadcast_address);
        if (!isValid) {
            setIpError('IP address is out of the valid range.');
        } else {
            setIpError(''); // Clear error if valid
        }
    };

    const handleUpdate = async () => {
        if (ipError) return; // Prevent updating if there's an error

        try {
            const _ = await fetch(`http://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/updateDevice/${selectedDetail?.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "name": String(deviceName),
                        "mac": String(macAddress),
                        "ip": String(ipAddress),
                        "port": String(port),
                        "network_id": String(selectedDetail.network.id)
                    })
                }
            );
            setOpenSettingModal(false);
            alert("success");
        } catch (error:any) {
            console.log(error);
            alert(error.message);
        }
    };

    return (
        <div>
            <Modal
                open={openSettingModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                BackdropProps={{ invisible: true }}
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
                                onClick={handleUpdate}
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
                            <FormHelperText className="mb-4">
                                Name of the device.
                            </FormHelperText>

                            <TextField
                                label="IP Address"
                                variant="standard"
                                fullWidth
                                value={ipAddress}
                                onChange={handleIpChange}
                                error={Boolean(ipError)}
                                helperText={ipError || 'The IP address of the network interface card.'}
                            />

                            <TextField
                                label="MAC Address"
                                variant="standard"
                                fullWidth
                                value={macAddress}
                                onChange={(e) => setMacAddress(e.target.value)}
                            />
                            <FormHelperText className="mb-4">
                                The MAC address of the target computer.
                            </FormHelperText>

                            <TextField
                                label="Port"
                                variant="standard"
                                fullWidth
                                value={port}
                                onChange={(e) => setPort(e.target.value)}
                            />
                            <FormHelperText className="mb-4">
                                The wake-on-LAN port.
                            </FormHelperText>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
};

export default SettingsModal;
