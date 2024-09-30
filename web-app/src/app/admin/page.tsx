'use server'
import ActivityLogs from '@/components/Admin/Dashboard/ActivityLogs';
import OfflineDevicesCard from '@/components/Admin/Dashboard/OfflineDevicesCard';
import OnlineDevicesCard from '@/components/Admin/Dashboard/OnlineDevicesCard';
import OverviewCard from '@/components/Admin/Dashboard/OverviewCard';
import QuickActions from '@/components/Admin/Dashboard/QuickActions';
import SchedulesWakeUp from '@/components/Admin/Dashboard/SchedulesWakeUp';
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
                <Grid container spacing={4} item xs={12} sm={12} md={9}>
                    {/* Online Devices Card */}
                    <Grid item xs={12} sm={6} md={4}>
                        <OnlineDevicesCard />
                    </Grid>
                    {/* Offline Devices Card */}
                    <Grid item xs={12} sm={6} md={4}>
                        <OfflineDevicesCard />
                    </Grid>
                    {/* Scheduled Wake-ups */}
                    <Grid item xs={12} sm={6} md={4}>
                        <SchedulesWakeUp />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <QuickActions />
                    </Grid>
                </Grid>
                {/* Network Static */}
                <Grid item xs={12} sm={12} md={3}>
                    <OverviewCard />
                </Grid>
            </Grid>

            {/* Activity Logs */}
            <Grid item xs={12} md={12}>
                <Typography variant="h5" className="mt-8 mb-4">
                    Recent Activity Logs
                </Typography>
                <ActivityLogs data_wakeLogs={data_wakeLogs} />
                
            </Grid>

        </div>
    )
}
