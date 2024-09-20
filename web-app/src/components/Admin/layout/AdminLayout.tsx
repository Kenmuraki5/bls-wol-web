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
              top: navbarHeight,
              left: 0,
              width: '250px',
              height: `calc(100vh - ${navbarHeight})`,
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
          mt: navbarHeight,
          ml: isSidebarOpen && !isMobile ? '250px' : '0',
          overflowX: 'hidden',
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
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            // Adjust layout and padding for different screen sizes
            p: { xs: 1, sm: 2, md: 3 },
            maxWidth: { xs: '100%', md: '100%' }, // Example max width for larger screens
            mx: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
