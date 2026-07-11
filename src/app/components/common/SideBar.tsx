import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, ClipboardList, BarChart3, Bell, LogOut,
  Users, Database, Cpu, GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { serif } from '../../utils/helpers';
import type { ActiveView } from '../../types';

export function Sidebar({ open }: { open: boolean }) {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const safeRole = role || 'student';

  const navItems: { id: ActiveView; icon: React.ElementType; label: string; path: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { id: 'courses', icon: BookOpen, label: 'Courses', path: '/courses' },
    { id: 'assignments', icon: ClipboardList, label: 'Assignments', path: '/assignments' },
    { id: 'grades', icon: BarChart3, label: 'Grades', path: '/grades' },
    { id: 'announcements', icon: Bell, label: 'Announcements', path: '/announcements' },
  ];

  const currentPath = location.pathname;
  const activeItem = navItems.find(item => 
    item.path === '/' ? currentPath === '/' : currentPath.startsWith(item.path)
  )?.id || 'dashboard';

  const roleAccent: Record<string, string> = { student: '#C4582A', lecturer: '#4A8A5C', admin: '#4470B4' };
  const roleInitials: Record<string, string> = { student: 'AF', lecturer: 'SC', admin: 'SR' };
  const roleNames: Record<string, string> = { student: 'Ahmad Fariz', lecturer: 'Dr. Sarah Chen', admin: 'Siti Rahimah' };
  const roleTitles: Record<string, string> = { student: '3rd Year · CS', lecturer: 'Lecturer · CS', admin: 'System Admin' };

  return (
    <aside
      className={`${open ? 'w-56' : 'w-[60px]'} flex-shrink-0 flex flex-col border-r border-border transition-all duration-300 overflow-hidden bg-sidebar`}
    >
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border gap-3 flex-shrink-0">
        <div className="w-8 h-8 flex-shrink-0 bg-primary rounded-lg flex items-center justify-center">
          <GraduationCap size={15} className="text-primary-foreground" />
        </div>
        {open && (
          <div className="min-w-0">
            <p className="font-bold text-sidebar-foreground text-sm leading-none" style={{ fontFamily: serif }}>UTN Portal</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Learning Management</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {navItems.map((item) => {
          const active = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              title={!open ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                active
                  ? 'bg-primary/15 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <item.icon size={16} className="flex-shrink-0" />
              {open && <span className="text-sm truncate">{item.label}</span>}
              {open && active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </nav>

      {open && safeRole === 'admin' && (
        <div className="px-2 pb-1">
          <div className="border-t border-sidebar-border pt-3 pb-1">
            <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">Admin Tools</p>
            {[
              { icon: Users, label: 'User Management' },
              { icon: Database, label: 'System Logs' },
              { icon: Cpu, label: 'Server Status' },
            ].map(item => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
              >
                <item.icon size={14} className="flex-shrink-0" />
                <span className="text-xs truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-sidebar-border p-3 mt-auto">
        <div className={`flex items-center gap-2.5 ${open ? '' : 'justify-center'}`}>
          <div
            className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
            style={{ background: roleAccent[safeRole] }}
          >
            {roleInitials[safeRole]}
          </div>
          {open && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">{roleNames[safeRole]}</p>
              <p className="text-[10px] text-muted-foreground truncate">{roleTitles[safeRole]}</p>
            </div>
          )}
          {open && (
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              title="Sign out"
            >
              <LogOut size={13} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}