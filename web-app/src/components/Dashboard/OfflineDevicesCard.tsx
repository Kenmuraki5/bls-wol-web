import { Card, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'

export default function OfflineDevicesCard() {
    return (
        <Grid item xs={12} md={3} sm={6}>
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent>
                    <Typography variant="h6" color="secondary" gutterBottom>
                        Devices Offline
                    </Typography>
                    <Typography variant="h4" color="textPrimary">
                        5
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        devices currently offline
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}
