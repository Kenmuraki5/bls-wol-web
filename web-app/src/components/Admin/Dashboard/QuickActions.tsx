import { Box, Button, Card, Grid, Typography } from '@mui/material'
import React from 'react'

export default function QuickActions() {
    return (
        <Box className="mt-8">
            <Typography variant="h5" className="mb-4">
                Quick Actions
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Card className="p-4">
                        <Typography variant="h6" gutterBottom>
                            Wake All Devices
                        </Typography>
                        <a href='/admin/wol-Actions/send-wol-signal'>
                            <Button variant="contained" color="primary" fullWidth >
                                Wake NOW
                            </Button>
                        </a>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card className="p-4">
                        <Typography variant="h6" gutterBottom>
                            Add New Device
                        </Typography>
                        <a href='/admin/wol-Actions/send-wol-signal'>
                            <Button variant="contained" color="primary" fullWidth >
                                ADD DEVICE
                            </Button>
                        </a>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card className="p-4">
                        <Typography variant="h6" gutterBottom>
                           NetWork Configure
                        </Typography>
                        <Button variant="outlined" color="info" fullWidth>
                            CONFIGURE NETWORKS
                        </Button>
                    </Card>
                </Grid>

            </Grid>
        </Box>
    )
}
