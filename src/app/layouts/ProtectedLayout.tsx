import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SideBar, TopBar } from '../components/common';
import { useTheme } from '../contexts/ThemeContext';
import { sans } from '../utils/helpers';

export function ProtectedLayout() {
  const { theme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className={`theme-${theme} flex h-screen bg-background text-foreground overflow-hidden`}
      style={{ fontFamily: sans }}
    >
      <SideBar open={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar onToggleSidebar={() => setSidebarOpen((o) => !o)} />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname} // re-triggers animation on route change
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex-1 overflow-y-auto p-6 lg:p-8"
            style={{ scrollbarWidth: 'none' }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}