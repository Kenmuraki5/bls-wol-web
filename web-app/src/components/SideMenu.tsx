'use client'
import React from 'react';
import { List, ListItemIcon, ListItemText, Collapse, ListItemButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesIcon from '@mui/icons-material/Devices';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const SideMenu: React.FC = () => {
  const [open, setOpen] = React.useState<{ [key: string]: boolean }>({
    deviceManagement: true,
    wolActions: true,
    networkManagement: true,
  });

  const handleClick = (menu: string) => {
    setOpen((prevOpen) => ({ ...prevOpen, [menu]: !prevOpen[menu] }));
  };

  const path = usePathname();

  return (
    <List sx={{ color: 'black' }}>
      {/* Dashboard */}
      <Link href="/admin">
        <ListItemButton>
          <ListItemIcon>
            <DashboardIcon style={{ color: path === '/admin' ? '#3B82F6' : '#0009' }} />
          </ListItemIcon>
          <ListItemText 
            secondaryTypographyProps={{
              fontSize: 15,
              color: path === '/admin' ? '#3B82F6' : '#0009'
            }} 
            secondary="Dashboard" 
          />
        </ListItemButton>
      </Link>

      {/* Device Management */}
      <ListItemButton onClick={() => handleClick('deviceManagement')}>
        <ListItemIcon>
          <DevicesIcon />
        </ListItemIcon>
        <ListItemText secondary="Device Management" />
        {open.deviceManagement ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open.deviceManagement} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link href="/admin/DeviceManagement/viewDevices">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText
                secondaryTypographyProps={{
                  fontSize: 15,
                  color: path === '/admin/DeviceManagement/viewDevices' ? '#3B82F6' : '#0009'
                }} 
                secondary="View Devices" 
              />
            </ListItemButton>
          </Link>
          <Link href="/admin/DeviceManagement/addDevices">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText
                secondaryTypographyProps={{
                  fontSize: 15,
                  color: path === '/admin/DeviceManagement/addDevices' ? '#3B82F6' : '#0009'
                }} 
                secondary="Add Device" 
              />
            </ListItemButton>
          </Link>
        </List>
      </Collapse>

      {/* Wake-on-LAN Actions */}
      <ListItemButton onClick={() => handleClick('wolActions')}>
        <ListItemIcon>
          <PowerSettingsNewIcon />
        </ListItemIcon>
        <ListItemText secondary="Wake-on-LAN Actions" />
        {open.wolActions ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open.wolActions} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link href="/admin/wol-Actions/send-wol-signal">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText
                secondaryTypographyProps={{
                  fontSize: 15,
                  color: path === '/admin/wol-Actions/send-wol-signal' ? '#3B82F6' : '#0009'
                }} 
                secondary="Send WOL Signal" 
              />
            </ListItemButton>
          </Link>
          <Link href="/admin/wol-Actions/scheduler">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText
                secondaryTypographyProps={{
                  fontSize: 15,
                  color: path === '/admin/wol-Actions/scheduler' ? '#3B82F6' : '#0009'
                }} 
                secondary="Schedule WOL" 
              />
            </ListItemButton>
          </Link>
        </List>
      </Collapse>

      {/* Network Management */}
      <ListItemButton onClick={() => handleClick('networkManagement')}>
        <ListItemIcon>
          <SettingsEthernetIcon />
        </ListItemIcon>
        <ListItemText secondary="Network Management" />
        {open.networkManagement ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open.networkManagement} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <Link href="/admin/NetworkManagement/viewNetworks">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText
                secondaryTypographyProps={{
                  fontSize: 15,
                  color: path === '/admin/NetworkManagement/viewNetworks' ? '#3B82F6' : '#0009'
                }} 
                secondary="View Networks" 
              />
            </ListItemButton>
          </Link>
          <Link href="/admin/NetworkManagement/networkConfigure">
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText
                secondaryTypographyProps={{
                  fontSize: 15,
                  color: path === '/admin/NetworkManagement/networkConfigure' ? '#3B82F6' : '#0009'
                }} 
                secondary="Network Configure" 
              />
            </ListItemButton>
          </Link>
        </List>
      </Collapse>

      {/* Logs & Activity Monitoring */}
      <Link href="/admin/LogMonitoring">
        <ListItemButton>
          <ListItemIcon style={{ color: path === '/admin/LogMonitoring' ? '#3B82F6' : '#0009' }}>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText
            secondaryTypographyProps={{
              fontSize: 15,
              color: path === '/admin/LogMonitoring' ? '#3B82F6' : '#0009'
            }}
            secondary="Logs & Activity Monitoring" 
          />
        </ListItemButton>
      </Link>

      {/* Settings */}
      <ListItemButton>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText secondary="Settings" />
      </ListItemButton>

      {/* Help & Documentation */}
      <ListItemButton>
        <ListItemIcon>
          <HelpIcon />
        </ListItemIcon>
        <ListItemText secondary="Help & Documentation" />
      </ListItemButton>

      {/* Logout */}
      <ListItemButton>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText secondary="Log out" />
      </ListItemButton>
    </List>
  );
};

export default SideMenu;
