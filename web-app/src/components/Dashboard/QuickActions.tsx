import { Box, Button, Card, Grid, Typography } from '@mui/material'
import React from 'react'

export default function QuickActions() {
    return (
        <Box className="mt-8">
            <Typography variant="h5" className="mb-4">
                Quick Actions
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card className="p-4">
                        <Typography variant="h6" gutterBottom>
                            Wake All Devices
                        </Typography>
                        <Button variant="contained" color="primary" fullWidth >
                            <a href='/admin/send-wol-signal'>Wake Now</a>
                        </Button>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card className="p-4">
                        <Typography variant="h6" gutterBottom>
                            Add New Device
                        </Typography>
                        <Button variant="outlined" color="secondary" fullWidth>
                            Add Device
                        </Button>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card className="p-4">
                        <Typography variant="h6" gutterBottom>
                            View Network Map
                        </Typography>
                        <Button variant="outlined" color="info" fullWidth>
                            Open Map
                        </Button>
                    </Card>
                </Grid>
                
            </Grid>
        </Box>
    )
}
