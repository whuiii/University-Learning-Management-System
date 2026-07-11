import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, TopBar } from '../components/common';
import { useTheme } from '../contexts/ThemeContext';
import { sans } from '../utils/helpers';

export function ProtectedLayout() {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className={`theme-${theme} flex h-screen bg-background text-foreground overflow-hidden`}
      style={{ fontFamily: sans }}
    >
      <Sidebar open={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar onToggleSidebar={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8" style={{ scrollbarWidth: 'none' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}