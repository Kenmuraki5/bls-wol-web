"use client"
import AddDevice from '@/components/Admin/DeviceManagement/AddDevice';
import React from 'react'

export default async function page() {
  const existingNetworks = ['Network 1', 'Network 2', 'Network 3'];

    const handleSaveDevice = (deviceData: any) => {
        console.log('Device Data:', deviceData);
        // ทำการบันทึกข้อมูลหรืออัพเดตข้อมูลที่นี่
    };

    return (
        <div>
            <AddDevice onSave={handleSaveDevice} existingNetworks={existingNetworks} />
        </div>
    );
}
