"use client"
import React from 'react'
import AddSubnet from '@/components/Admin/NetworkManagement/AddSubnet';

export default function page() {
  const handleSaveSubnet = (subnetData: any) => {
    console.log('Saved Subnet Data:', subnetData);
    // สามารถทำการส่งข้อมูลไปยัง API หรือบันทึกที่อื่นได้ที่นี่
    // เช่น fetch('/api/saveSubnet', { method: 'POST', body: JSON.stringify(subnetData) })
  };

  return (
    <div>
       <AddSubnet onSave={handleSaveSubnet} />
    </div>
  )
}
