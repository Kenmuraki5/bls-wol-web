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

  const handleActiveItem = (item: string) => {
    router.push("/admin/" + item)
  };

  return (
    <List sx={{ color: 'black' }}>
      {/* Dashboard */}
      <ListItemButton onClick={() => handleActiveItem('')}>
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
          <ListItemButton sx={{ pl: 4 }} onClick={() => handleActiveItem("viewDevices")}>
            <ListItemText
              secondaryTypographyProps={{
                fontSize: 15,
                color: path === '/admin/viewDevices' ? '#3B82F6' : '#0009'
              }} secondary="View Devices" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText secondary="Add Device" />
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
          <ListItemButton sx={{ pl: 4 }} onClick={() => handleActiveItem("send-wol-signal")}>
            <ListItemText
              secondaryTypographyProps={{
                fontSize: 15,
                color: path === '/admin/send-wol-signal' ? '#3B82F6' : '#0009'
              }}
              secondary="Send WOL Signal" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText secondary="Schedule WOL" />
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
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText secondary="View Networks" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText secondary="Configure Networks" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Logs & Activity Monitoring */}
      <ListItemButton onClick={() => handleClick('logs')}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText secondary="Logs & Activity Monitoring" />
        {open.logs ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open.logs} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText secondary="WOL Logs" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText secondary="Activity Logs" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* User Management */}
      <ListItemButton onClick={() => handleClick('userManagement')}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText secondary="User Management" />
        {open.userManagement ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open.userManagement} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText secondary="View Users" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText secondary="Add User" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Reports */}
      <ListItemButton onClick={() => handleClick('reports')}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText secondary="Reports" />
        {open.reports ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open.reports} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText secondary="Generate Reports" />
          </ListItemButton>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText secondary="View Reports" />
          </ListItemButton>
        </List>
      </Collapse>

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
