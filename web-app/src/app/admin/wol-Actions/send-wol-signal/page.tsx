'use client'
import { handleWakeClient } from '@/lib/wake';
import { Typography } from '@mui/material';
import React, { useState } from 'react';

export default function SendWoLSignalPage() {
  const [macAddress, setMacAddress] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [pingAddress, setPingAddress] = useState('');
  const [port, setPort] = useState('');


  const handleSubmit = async (e: any) => {
    e.preventDefault();
  
    const payloadData = {
      mac_address: macAddress,
      ip_address: pingAddress,
      network_address: ipAddress,
      port: 9
    };
  
    try {
      await handleWakeClient(payloadData);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };
  

  return (
    <div className="p-4 w-full mt-5">
      <Typography variant="h4" component="h1" className="text-primary" color="black">
        Wake-on-lan - Magic Packet
      </Typography>
      <Typography variant="subtitle1" component="p" color="textSecondary">
        Monitor the status and manage Devices in your organization.
      </Typography>
      <h2 className="text-xl font-bold mb-4 text-black">Wake on LAN Action</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="macAddress">MAC Address</label>
          <input
            type="text"
            id="macAddress"
            value={macAddress}
            onChange={(e) => setMacAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="e.g. 00:11:22:33:44:55"
            required
          />
          <Typography variant="subtitle1" component="p" color="textSecondary">
            Enter the mac address of the target computer. This can be found on the network interface card settings on your computer.
          </Typography>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="ipAddress">IP Address</label>
          <input
            type="text"
            id="ipAddress"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="e.g. 192.168.1.255"
            required
          />
          <Typography variant="subtitle1" component="p" color="textSecondary">
            Enter the IP address of the target computer or use the brodcast address of the sub-network, for example 192.168.0.255, 192.168.1.255, 192.168.1.255, 10.0.0.255
          </Typography>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="pingAddress">Ping Address</label>
          <input
            type="text"
            id="pingAddress"
            value={pingAddress}
            onChange={(e) => setPingAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="e.g. 192.158.0.15"
            required
          />
          <Typography variant="subtitle1" component="p" color="textSecondary">
            Enter the IP address of the network interface card you would like the devices awake status to come from, for example 192.158.0.15
          </Typography>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="port">Port</label>
          <input
            type="number"
            id="port"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="e.g. 9"
            required
          />
          <Typography variant="subtitle1" component="p" color="textSecondary">
            Enter the wake on LAN port Usually, port 9 is supported by most ethernet cards but you can also try 7 or 0.
          </Typography>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Wake Device
        </button>
      </form>
    </div>
  );
}
