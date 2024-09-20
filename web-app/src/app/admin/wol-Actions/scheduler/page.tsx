'use client'
import { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Grid, Box, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// ข้อมูลสมมุติเครื่องคอมพิวเตอร์
const computers = [
  { id: '1', name: 'Computer 1', macAddress: '00:1A:2B:3C:4D:5E' },
  { id: '2', name: 'Computer 2', macAddress: '00:1A:2B:3C:4D:5F' },
  // เพิ่มรายการเครื่องคอมพิวเตอร์ที่นี่
];

// ข้อมูลสมมุตารายการตั้งเวลา
const schedules = [
  { id: '1', computerName: 'Computer 1', scheduleTime: '2024-09-19T08:00:00Z' },
  { id: '2', computerName: 'Computer 2', scheduleTime: '2024-09-20T09:00:00Z' },
  // เพิ่มรายการตั้งเวลาที่นี่
];

const AdminScheduler = () => {
  const [selectedComputer, setSelectedComputer] = useState('');
  const [scheduleTime, setScheduleTime] = useState(null);
  const [scheduleList, setScheduleList] = useState(schedules);

  const handleSchedule = () => {
    if (!selectedComputer || !scheduleTime) {
      alert('Please select a computer and schedule a time');
      return;
    }

    const newSchedule = {
      id: (scheduleList.length + 1).toString(),
      computerName: computers.find(computer => computer.macAddress === selectedComputer)?.name || 'Unknown',
      scheduleTime: scheduleTime.toISOString(),
    };

    setScheduleList([...scheduleList, newSchedule]);
    setSelectedComputer('');
    setScheduleTime(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <Card className="w-full max-w-lg shadow-lg mb-6">
        <CardContent>
          <Typography variant="h4" className="text-center text-gray-800 font-bold mb-6">
            Wake on LAN Scheduler
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              {/* Dropdown สำหรับเลือกเครื่องคอมพิวเตอร์ */}
              <FormControl fullWidth>
                <InputLabel>Computer</InputLabel>
                <Select
                  value={selectedComputer}
                  onChange={(e) => setSelectedComputer(e.target.value)}
                  label="Computer"
                >
                  {computers.map((computer) => (
                    <MenuItem key={computer.id} value={computer.macAddress}>
                      {computer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              {/* DateTimePicker สำหรับเลือกเวลาการปลุก */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Schedule Time"
                  value={scheduleTime}
                  onChange={(newValue) => setScheduleTime(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Box className="flex justify-center mt-4">
                {/* ปุ่มสำหรับตั้งเวลา */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSchedule}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Schedule Wake on LAN
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ตารางแสดงรายการการตั้งเวลา */}
      <Card className="w-full max-w-lg shadow-lg">
        <CardContent>
          <Typography variant="h5" className="text-center text-gray-800 font-bold mb-4">
            Scheduled Tasks
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Computer Name</TableCell>
                  <TableCell>Scheduled Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scheduleList.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>{schedule.computerName}</TableCell>
                    <TableCell>{new Date(schedule.scheduleTime).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminScheduler;
