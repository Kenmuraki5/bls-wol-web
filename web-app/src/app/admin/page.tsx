'use server'
import ActivityLogs from '@/components/Dashboard/ActivityLogs';
import NetworkStatisticsCard from '@/components/Dashboard/IpStatistics';
import OfflineDevicesCard from '@/components/Dashboard/OfflineDevicesCard';
import OnlineDevicesCard from '@/components/Dashboard/OnlineDevicesCard';
import QuickActions from '@/components/Dashboard/QuickActions';
import SchedulesWakeUp from '@/components/Dashboard/SchedulesWakeUp';
import { Typography, Grid, Card, CardContent, Button, Box } from '@mui/material'
import React from 'react'

export default async function Dashboard() {

    let data_wakeLogs
    try {
        let wakeLogs = await fetch(`http://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/admin/wakeLog`, { next: { revalidate: 3600 } });
        data_wakeLogs = await wakeLogs.json();
        data_wakeLogs = data_wakeLogs.data;
    } catch (error) {
        console.log(error);
    }
    return (
        <div>
            {/* Header */}
            <Box className="mb-8">
                <Typography variant="h4" component="h1" className="text-primary mb-4">
                    Dashboard - Wake on LAN
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Manage and monitor devices on your network with ease.
                </Typography>
            </Box>

            {/* Status Cards */}
            <Grid container spacing={4}>
                {/* Online Devices Card */}
                <OnlineDevicesCard />

                {/* Offline Devices Card */}
                <OfflineDevicesCard />

                {/* Scheduled Wake-ups */}
                <SchedulesWakeUp />
                {/* Network Static */}
                <NetworkStatisticsCard />
            </Grid>

            {/* Quick Actions */}
            <QuickActions />

            {/* Activity Logs */}
            <ActivityLogs data_wakeLogs={data_wakeLogs} />
        </div>
    )
}
