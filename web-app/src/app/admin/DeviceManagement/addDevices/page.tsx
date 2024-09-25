'use server'
import AddDevice from '@/components/Admin/DeviceManagement/AddDevice';
import React from 'react'

export default async function page() {
  let existingNetworks;
  try {
    const res = await fetch(`http://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/networks`)
    const network_data:any = await res.json()
    existingNetworks = network_data?.data
  } catch (error:any) {
    console.log(error.message)
  }
    return (
        <div>
            <AddDevice existingNetworks={existingNetworks} />
        </div>
    );
}
