'use server';
import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
} from '@mui/material';
import { DataGrid, GridRowModesModel, GridRowsProp, GridSlots, GridToolbarContainer } from '@mui/x-data-grid';
import WifiIcon from '@mui/icons-material/Wifi';
import ActivityLogs from '@/components/Admin/Dashboard/ActivityLogs';


interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

const LogMonitorPage = async () => {
    let data_wakeLogs = []
    try {
        let wakeLogs = await fetch(`http://${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/admin/wakeLog`, { next: { revalidate: 3600 } });
        data_wakeLogs = await wakeLogs.json();
        data_wakeLogs = data_wakeLogs.data;
    } catch (error) {
        console.log(error);
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 250 },
        { field: 'ip', headerName: 'IP Address', width: 150 },
        { field: 'mac', headerName: 'MAC Address', width: 200 },
        { field: 'port', headerName: 'Port', width: 80 },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params: any) => (
                <Box>
                    <WifiIcon sx={{ color: params.value === 'online' ? 'green' : 'red', fontWeight: 'bold' }} />
                    {params.value === 'online' ? 'Online' : 'Offline'}
                </Box>
            ),
        },
    ];


    return (
        <div className='overflow-hidden'>
            <Typography variant="h4" component="h1" className="text-primary" color="black">
                Logs & Activity Monitoring
            </Typography>
            <Typography variant="subtitle1" component="p" color="textSecondary">
                Monitor the Activity wol in your organization.
            </Typography>
            <Box sx={{ height: 700, width: '100%', position: 'relative', mt: 2 }}>
                {!data_wakeLogs.length && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}
                <ActivityLogs data_wakeLogs={data_wakeLogs} />
            </Box>
        </div>
    );
};

export default LogMonitorPage;
