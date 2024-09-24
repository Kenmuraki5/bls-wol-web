import React, { useState } from 'react';
import { Box, Button, Typography, TextField, FormHelperText, Divider } from '@mui/material';

const AddSubnet = ({ onSave }: { onSave: (subnetData: any) => void }) => {
    const [subnetName, setSubnetName] = useState('');
    const [networkAddress, setNetworkAddress] = useState('');
    const [subnetMask, setSubnetMask] = useState('');
    const [broadcastAddress, setBroadcastAddress] = useState('');

    const handleSave = () => {
        const subnetData = {
            subnetName,
            networkAddress,
            subnetMask,
            broadcastAddress,
        };
        onSave(subnetData);

        // Reset fields after saving
        setSubnetName('');
        setNetworkAddress('');
        setSubnetMask('');
        setBroadcastAddress('');
    };

    return (
        <Box className="text-black p-4">
            <Typography variant="h6" className="mb-4">Add New Subnet</Typography>
            <Box sx={{ backgroundColor: '#f0f4ff', padding: 2, borderRadius: 1, marginBottom: 4 }}>
                <Typography variant="body2">
                    Please fill in the details for the new subnet you want to add.
                </Typography>
            </Box>
            <Divider className="mb-4" />

            <TextField
                label="Subnet Name"
                variant="standard"
                fullWidth
                className="mb-4"
                value={subnetName}
                onChange={(e) => setSubnetName(e.target.value)}
            />
            <FormHelperText>Name of the subnet.</FormHelperText>

            <TextField
                label="Network Address"
                variant="standard"
                fullWidth
                className="mb-4"
                value={networkAddress}
                onChange={(e) => setNetworkAddress(e.target.value)}
            />
            <FormHelperText>The network address of the subnet (e.g., 192.168.1.0).</FormHelperText>

            <TextField
                label="Subnet Mask"
                variant="standard"
                fullWidth
                className="mb-4"
                value={subnetMask}
                onChange={(e) => setSubnetMask(e.target.value)}
            />
            <FormHelperText>The subnet mask of the subnet (e.g., 255.255.255.0).</FormHelperText>

            <TextField
                label="Broadcast Address"
                variant="standard"
                fullWidth
                className="mb-4"
                value={broadcastAddress}
                onChange={(e) => setBroadcastAddress(e.target.value)}
            />
            <FormHelperText>The broadcast address of the subnet (e.g., 192.168.1.255).</FormHelperText>

            <Button variant="contained" color="primary" onClick={handleSave}>
                Save
            </Button>
        </Box>
    );
};

export default AddSubnet;
