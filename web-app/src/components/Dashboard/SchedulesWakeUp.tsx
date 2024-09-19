import { Card, CardContent, Grid, Typography } from '@mui/material'
import React from 'react'

export default function SchedulesWakeUp() {
    return (
        <Grid item xs={12} sm={4}>
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent>
                    <Typography variant="h6" color="info" gutterBottom>
                        Scheduled Wake-ups
                    </Typography>
                    <Typography variant="h4" color="textPrimary">
                        3
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        upcoming scheduled wakes
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}
