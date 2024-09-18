'use client';

import { useState } from 'react';
import { Button, Box, TextField } from '@mui/material';

const AddNewDeviceButton = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ip: '',
    mac: '',
    port: '',
    department: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // You can handle the submission logic here (e.g., send data to the server)
    setShowForm(false); // Hide the form after submission
  };

  return (
    <div>
      <div className="flex items-center">
        <button className="btn btn-sm btn-outline-success mr-2" title="Add new device" onClick={() => setShowForm(!showForm)}>
          <i className="bi bi-plus-lg mr-2"></i>  {showForm ? 'Cancel' : 'New'}
        </button>
      </div>

      {showForm && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mb: 4, p: 4, border: '1px solid', borderRadius: 2, borderColor: 'grey.300' }}
        >
          <TextField
            label="IP Address"
            name="ip"
            fullWidth
            margin="normal"
            value={formData.ip}
            onChange={handleInputChange}
          />
          <TextField
            label="MAC Address"
            name="mac"
            fullWidth
            margin="normal"
            value={formData.mac}
            onChange={handleInputChange}
          />
          <TextField
            label="Port"
            name="port"
            type="number"
            fullWidth
            margin="normal"
            value={formData.port}
            onChange={handleInputChange}
          />
          <TextField
            label="Department"
            name="department"
            fullWidth
            margin="normal"
            value={formData.department}
            onChange={handleInputChange}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      )}
    </div>
  );
};

export default AddNewDeviceButton;
