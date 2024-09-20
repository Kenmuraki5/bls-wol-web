import React, { useState } from 'react';
import { Box, Button, Typography, TextField, FormHelperText, Divider, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const AddDevice = ({ onSave, existingNetworks }: { onSave: (deviceData: any) => void; existingNetworks: string[]; }) => {
    const [deviceName, setDeviceName] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [macAddress, setMacAddress] = useState('');
    const [port, setPort] = useState('');
    const [selectedNetwork, setSelectedNetwork] = useState('');
    const [newNetwork, setNewNetwork] = useState('');
    const [isCreatingNewNetwork, setIsCreatingNewNetwork] = useState(false);

    const handleSave = () => {
        const deviceData = {
            deviceName,
            ipAddress,
            macAddress,
            port,
            network: isCreatingNewNetwork ? newNetwork : selectedNetwork, // Use selected network or new network
        };
        onSave(deviceData);
        // Reset fields after saving
        setDeviceName('');
        setIpAddress('');
        setMacAddress('');
        setPort('');
        setSelectedNetwork('');
        setNewNetwork('');
        setIsCreatingNewNetwork(false);
    };

    return (
        <Box className="text-black p-4">
            <Typography variant="h6" className="mb-4">Add New Device</Typography>
            <Box sx={{ backgroundColor: '#f0f4ff', padding: 2, borderRadius: 1, marginBottom: 4 }}>
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
                <Select
                    value={selectedNetwork}
                    onChange={(e) => {
                        setSelectedNetwork(e.target.value);
                        setIsCreatingNewNetwork(false); // Reset when selecting existing network
                    }}
                    displayEmpty
                >
                    <MenuItem value="">
                        <em>Select a Network</em>
                    </MenuItem>
                    {existingNetworks.map((network, index) => (
                        <MenuItem key={index} value={network}>{network}</MenuItem>
                    ))}
                </Select>
                <FormHelperText>Choose an existing network or create a new one.</FormHelperText>
            </FormControl>

            <Box className="mb-4">
                <Button variant="outlined" onClick={() => setIsCreatingNewNetwork(true)}>
                    Create New Network
                </Button>
            </Box>

            {isCreatingNewNetwork && (
                <TextField
                    label="New Network Name"
                    variant="standard"
                    fullWidth
                    className="mb-4"
                    value={newNetwork}
                    onChange={(e) => setNewNetwork(e.target.value)}
                />
            )}
            {isCreatingNewNetwork && (
                <FormHelperText>Name for the new network.</FormHelperText>
            )}

            <Button variant="contained" color="primary" onClick={handleSave}>
                Save
            </Button>
        </Box>
    );
};

export default AddDevice;
