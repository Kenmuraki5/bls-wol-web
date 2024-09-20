import { Card, CardContent, Grid, Typography, Box, Divider } from '@mui/material';
import React from 'react';

// ตัวอย่างข้อมูล
const dashboardData = {
    networks: 5,
    subnets: 10,
    computers: 50,
    devices: 100,
};

export default function OverviewCard() {
    return (
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className='h-64'>
                    <Typography variant="h6" gutterBottom align="center">
                        Network Overview
                    </Typography>
                    <Divider style={{ marginBottom: '15px' }} />

                    <Grid container direction="column" spacing={2}>
                        {/* Networks */}
                        <Grid item>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="textSecondary">
                                    Networks
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {dashboardData.networks}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Subnets */}
                        <Grid item>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="textSecondary">
                                    Subnets
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {dashboardData.subnets}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Computers */}
                        <Grid item>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="textSecondary">
                                    Computers
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {dashboardData.computers}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Devices */}
                        <Grid item>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="textSecondary">
                                    Devices
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {dashboardData.devices}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
    );
}
