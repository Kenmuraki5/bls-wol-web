import { Card, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'

export default function OnlineDevicesCard() {
    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                    Devices Online
                </Typography>
                <Typography variant="h4" color="textPrimary">
                    16
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    devices currently running
                </Typography>
            </CardContent>
        </Card>
    )
}
