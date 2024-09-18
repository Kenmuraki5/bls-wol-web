'use client'
import SideMenu from '@/components/SideMenu';
import { Box, Drawer, IconButton, Typography, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import {
  Menu as MenuIcon,
} from '@mui/icons-material';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery('(max-width:600px)');
  const navbarHeight = '64px';

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'white' }}>
      {isMobile ? (
        <Drawer open={isSidebarOpen} onClose={handleToggleSidebar}>
          <SideMenu />
        </Drawer>
      ) : (
        isSidebarOpen && (
          <Box
            sx={{
              position: 'fixed',
              top: navbarHeight, // Start the sidebar below the navbar
              left: 0,
              width: '250px',
              height: `calc(100vh - ${navbarHeight})`, // Adjust height to fill the screen below the navbar
              borderRight: '1px solid #ddd',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'white',
              overflowY: 'auto',
            }}
          >
            <SideMenu />
          </Box>
        )
      )}
      <Box
        sx={{
          flex: 1,
          mt: 5,
          ml: isSidebarOpen && !isMobile ? '250px' : '0',
          // pt: navbarHeight,
          overflowx: 'hidden',
          p: { xs: 2, md: 3 },
          position: 'relative',
          display: isMobile && isSidebarOpen ? 'none' : 'block',
        }}
      >
        <header>
          <IconButton onClick={handleToggleSidebar} sx={{ mr: 2, border: '1px solid #ddd' }}>
            <MenuIcon />
          </IconButton>
        </header>
        
        {children}
      </Box>
    </Box>
  );
}
