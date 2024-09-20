export const handleWake = async (deviceId: string) => {
  try {
    const res = await fetch(`http://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/wol/${deviceId}`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imtlbm11NSIsImlkIjoiMSIsImV4cCI6MTcyNjIyMzk0NH0.A4WQWU6B9DdgLuGzsELBdHDtCcMVu1o-qd5dgC4_CWA',
      },
    });

    if (!res.ok) {
      throw new Error('Failed to wake up the device');
    }

    const result = await res.json();
    alert(`Device with ID ${deviceId} has been woken up!`);
  } catch (error) {
    console.error('Error waking up the device:', error);
    alert('Failed to wake up the device.');
  }
};

export const handleWakeClient = async (payloadData: any) => {
  try {
    const res = await fetch(`http://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/wolClient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payloadData)
    });

    if (!res.ok) {
      throw new Error('Failed to wake up the device');
    }

    const result = await res.json();
    alert(`The magic packet has been sent.`);
  } catch (error) {
    console.error('Error waking up the device:', error);
    alert('Failed to wake up the device.');
  }
};

export const handleWakeMoreDevice = async (payloadData: any) => {
  try {
    const res = await fetch(`http://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/wols`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payloadData)
    });

    if (!res.ok) {
      throw new Error('Failed to wake up the device');
    }

    const result = await res.json();
    alert(`The magic packet has been sent.`);
  } catch (error:any) {
    console.error('Error waking up the device:', error);
    // alert('Failed: '+ error.message);
  }
};
