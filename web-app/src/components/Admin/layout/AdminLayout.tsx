'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesIcon from '@mui/icons-material/Devices';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import type { ReactNode } from 'react';
import Container from '@mui/material/Container';
import { useRouter, usePathname } from 'next/navigation'; // ใช้ usePathname เพื่อดึงข้อมูล pathname จาก URL

const NAVIGATION: any = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'admin',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Management',
  },
  {
    segment: 'admin/DeviceManagement',
    title: 'Device Management',
    icon: <DevicesIcon />,
    children: [
      {
        segment: 'viewDevices',
        title: 'View Devices',
      },
      {
        segment: 'addDevices',
        title: 'Add Device',
      },
    ],
  },
  {
    segment: 'admin/wol-Actions',
    title: 'Wake-on-LAN Actions',
    icon: <PowerSettingsNewIcon />,
    children: [
      {
        segment: 'send-wol-signal',
        title: 'Send WOL Signal',
      },
      {
        segment: 'scheduler',
        title: 'Schedule WOL',
      },
    ],
  },
  {
    segment: 'admin/NetworkManagement',
    title: 'Network Management',
    icon: <SettingsEthernetIcon />,
    children: [
      {
        segment: 'viewNetworks',
        title: 'View Networks',
      },
      {
        segment: 'networkConfigure',
        title: 'Network Configure',
      },
    ],
  },
  {
    segment: 'admin/LogMonitoring',
    title: 'Logs & Activity Monitoring',
    icon: <AssignmentIcon />,
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function AdminPageContent({ pathname, children }: { pathname: string; children: ReactNode }) {
  return (
      <Box
        sx={{
          m: 4,
        }}
      >
        {pathname}
        {children}
      </Box>
  );
}

interface DemoProps {
  window?: () => Window;
  children?: ReactNode;
}

export default function AdminLayout(props: DemoProps) {
  const { window, children } = props;
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const customRouter: any = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: handleNavigation,
    };
  }, [pathname]);

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <PowerSettingsNewIcon className='mt-2'/>,
        title: 'BLS WOL-WEB',
      }}
      router={customRouter}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <AdminPageContent pathname={pathname}>{children}</AdminPageContent>
      </DashboardLayout>
    </AppProvider>
  );
}
