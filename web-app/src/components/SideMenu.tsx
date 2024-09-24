'use client'
import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, colors } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesIcon from '@mui/icons-material/Devices';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Router } from 'next/router';
import { usePathname, useRouter } from 'next/navigation';

const SideMenu: React.FC = () => {
  const [open, setOpen] = React.useState<{ [key: string]: boolean }>({
    deviceManagement: false,
    wolActions: false,
    networkManagement: false,
    logs: false,
    userManagement: false,
    reports: false,
  });

  const handleClick = (menu: string) => {
    setOpen((prevOpen) => ({ ...prevOpen, [menu]: !prevOpen[menu] }));
  };
  const [activeItem, setActiveItem] = React.useState<string>('Dashboard');

  const router = useRouter();
  const path = usePathname();

  const Navigate = (item: string) => {
    router.push("/admin/" + item)
  };

  return (
    <List sx={{ color: 'black' }}>
      {/* Dashboard */}
      <ListItemButton onClick={() => Navigate('')}>
        <ListItemIcon>
          <DashboardIcon style={{color: path === '/admin' ? '#3B82F6' : '#0009'}} />
        </ListItemIcon>
        <ListItemText secondaryTypographyProps={{
          fontSize: 15,
          color: path === '/admin' ? '#3B82F6' : '#0009'
        }} secondary="Dashboard" />
      </ListItemButton>

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
          <ListItemButton sx={{ pl: 4 }} onClick={() => Navigate("DeviceManagement/viewDevices")}>
            <ListItemText
              secondaryTypographyProps={{
                fontSize: 15,
                color: path === '/admin/DeviceManagement/viewDevices' ? '#3B82F6' : '#0009'
              }} secondary="View Devices" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} onClick={() => Navigate("DeviceManagement/addDevices")}>
            <ListItemText
              secondaryTypographyProps={{
                fontSize: 15,
                color: path === '/admin/DeviceManagement/addDevices' ? '#3B82F6' : '#0009'
              }} secondary="Add Device" />
          </ListItemButton>
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
          <ListItemButton sx={{ pl: 4 }} onClick={() => Navigate("wol-Actions/send-wol-signal")}>
            <ListItemText
              secondaryTypographyProps={{
                fontSize: 15,
                color: path === '/admin/wol-Actions/send-wol-signal' ? '#3B82F6' : '#0009'
              }}
              secondary="Send WOL Signal" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}  onClick={() => Navigate("wol-Actions/scheduler")}>
            <ListItemText 
              secondaryTypographyProps={{
                fontSize: 15,
                color: path === '/admin/wol-Actions/scheduler' ? '#3B82F6' : '#0009'
              }}
              secondary="Schedule WOL" />
          </ListItemButton>
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
          <ListItemButton sx={{ pl: 4 }} onClick={() => Navigate("NetworkManagement/viewNetworks")}>
            <ListItemText 
              secondaryTypographyProps={{
                fontSize: 15,
                color: path === '/admin/NetworkManagement/viewNetworks' ? '#3B82F6' : '#0009'
              }}
              secondary="View Networks" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }} onClick={() => Navigate("NetworkManagement/addSubnet")}>
            <ListItemText 
              secondaryTypographyProps={{
                fontSize: 15,
                color: path === '/admin/NetworkManagement/addSubnet' ? '#3B82F6' : '#0009'
              }}
              secondary="Add Subnet" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Logs & Activity Monitoring */}
      <ListItemButton onClick={() => Navigate("LogMonitoring")}>
        <ListItemIcon style={{color: path === '/admin/LogMonitoring' ? '#3B82F6' : '#0009'}}>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText
          secondaryTypographyProps={{
            fontSize: 15,
            color: path === '/admin/LogMonitoring' ? '#3B82F6' : '#0009'
          }}
          secondary="Logs & Activity Monitoring" />
      </ListItemButton>

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
        <ListItemText
          secondary="Log out" />
      </ListItemButton>
    </List>
  );
};

export default SideMenu;
