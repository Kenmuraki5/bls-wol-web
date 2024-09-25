import DataGridNetwork from '@/components/Admin/NetworkManagement/DataGridNetwork';
import React, { useEffect, useState } from 'react';

export default async function Page() {
  const fetchDeviceData = async () => {
    const mockData = [
      { id: 1, network_id: 'net-001', name: 'Network 1', network_address: '192.168.1.0', subnet_mask: '255.255.255.0', broadcast_address: '192.168.1.255' },
      { id: 2, network_id: 'net-002', name: 'Network 2', network_address: '192.168.2.0', subnet_mask: '255.255.255.0', broadcast_address: '192.168.2.255' },
      { id: 3, network_id: 'net-003', name: 'Network 3', network_address: '192.168.3.0', subnet_mask: '255.255.255.0', broadcast_address: '192.168.3.255' },
      { id: 4, network_id: 'net-004', name: 'Network 4', network_address: '192.168.4.0', subnet_mask: '255.255.255.0', broadcast_address: '192.168.4.255' },
      { id: 5, network_id: 'net-005', name: 'Network 5', network_address: '192.168.5.0', subnet_mask: '255.255.255.0', broadcast_address: '192.168.5.255' },
    ];

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockData;
  };
  let network_data = await fetchDeviceData();

  return (
    <div className='overflow-hidden'>
      <DataGridNetwork network_data={network_data}/>
    </div>
  );
}
