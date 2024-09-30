'use client'
import React, { useState } from 'react';
import { Box, Button, Typography, TextField, FormHelperText, Divider, MenuItem, Select, InputLabel, FormControl, IconButton, Link } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const AddDevice = ({ existingNetworks }: { existingNetworks: any[]; }) => {
    const [deviceName, setDeviceName] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [macAddress, setMacAddress] = useState('');
    const [port, setPort] = useState('');
    const [selectedNetwork, setSelectedNetwork] = useState('');

    const handleSave = () => {
        const deviceData = {
            deviceName,
            ipAddress,
            macAddress,
            port,
            network: selectedNetwork,
        };
        console.log(deviceData)
        setDeviceName('');
        setIpAddress('');
        setMacAddress('');
        setPort('');
        setSelectedNetwork('');
    };

    const handleRefresh = async () => {
        try {
            const res = await fetch(`http://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/networks`)
            const network_data:any = await res.json()
            existingNetworks = network_data?.data
          } catch (error:any) {
            console.log(error.message)
          }
    };

    return (
        <Box className="p-4">
            <Typography variant="h6" className="mb-4">Add New Device</Typography>
            <Box sx={{ backgroundColor: '#f0f4ff', padding: 2, borderRadius: 1, marginBottom: 4, color:'black' }}>
                <Typography variant="body2">
                    Please fill in the details for the new device you want to add.
                    You can either choose an existing network or create a new one.
                </Typography>
            </Box>
            <Divider className="mb-4" />

            <TextField
                label="Device Name"
                variant="standard"
                fullWidth
                className="mb-4"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
            />
            <FormHelperText>Name of the device.</FormHelperText>

            <TextField
                label="IP Address"
                variant="standard"
                fullWidth
                className="mb-4"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
            />
            <FormHelperText>The IP address of the network interface card.</FormHelperText>

            <TextField
                label="MAC Address"
                variant="standard"
                fullWidth
                className="mb-4"
                value={macAddress}
                onChange={(e) => setMacAddress(e.target.value)}
            />
            <FormHelperText>The MAC address of the target computer.</FormHelperText>

            <TextField
                label="Port"
                variant="standard"
                fullWidth
                className="mb-4"
                value={port}
                onChange={(e) => setPort(e.target.value)}
            />
            <FormHelperText>The wake-on-LAN port. Usually, port 9 is supported.</FormHelperText>

            <FormControl fullWidth className="mb-4">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" flex={1}>
                        <Select
                            value={selectedNetwork}
                            onChange={(e) => {
                                setSelectedNetwork(e.target.value);
                            }}
                            displayEmpty
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <em>Select a Network</em>;
                                }
                                const selectedNetworkDetail = existingNetworks.find((network) => network.id === selected);
                                return selectedNetworkDetail ? (
                                    <Typography>
                                        {selectedNetworkDetail.name}
                                    </Typography>
                                ) : <em>Select a Network</em>;
                            }}
                            style={{ flex: 1 }}
                        >
                            <MenuItem value="">
                                <em>Select a Network</em>
                            </MenuItem>
                            {existingNetworks.map((network, index) => (
                                <MenuItem key={index} value={network.id}>
                                    <Box display="flex" flexDirection="column">
                                        <Typography variant="body1" fontWeight="bold">
                                            {network.name} ({network.description})
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Network ID: {network.id}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Network Address: {network.network_address}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Subnets: {network.subnet_mask} Subnet(s)
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>

                        {/* Refresh Icon */}
                        <IconButton onClick={handleRefresh} style={{ marginLeft: '8px' }}>
                            <RefreshIcon />
                        </IconButton>
                    </Box>

                    {/* Create New Network Button */}
                    <Link
                        href="/admin/NetworkManagement/networkConfigure" variant="body2"
                        style={{ marginLeft: '16px' }}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Create Network
                    </Link>
                </Box>

                <FormHelperText>Choose an existing network or create a new one.</FormHelperText>
            </FormControl>

            <Box className="mb-4">
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                </Button>
            </Box>
        </Box>
    );
};

export default AddDevice;
