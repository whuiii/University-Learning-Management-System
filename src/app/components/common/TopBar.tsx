import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, ChevronRight, Search, Bell } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { serif } from '../../utils/helpers';

export function TopBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  let title = 'Dashboard';
  if (path === '/courses') title = 'Courses';
  else if (path.startsWith('/courses/')) title = 'Course Detail';
  else if (path === '/assignments') title = 'Assignments';
  else if (path === '/grades') title = 'Grades';
  else if (path === '/announcements') title = 'Announcements';

  const isCourseDetail = path.startsWith('/courses/') && path !== '/courses';
  const handleBack = isCourseDetail ? () => navigate('/courses') : undefined;

  return (
    <header className="h-16 flex items-center px-5 bg-card border-b border-border gap-3 flex-shrink-0">
      <button onClick={onToggleSidebar} className="text-muted-foreground hover:text-foreground transition-colors p-1">
        <Menu size={18} />
      </button>
      {handleBack && (
        <button onClick={handleBack} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight size={13} className="rotate-180" /> Back
        </button>
      )}
      <h2 className="font-normal text-foreground truncate" style={{ fontFamily: serif, fontSize: '1.05rem' }}>
        {title}
      </h2>
      <div className="flex-1" />
      <div className="hidden md:flex items-center gap-2 bg-secondary rounded-xl px-3.5 py-2 w-56">
        <Search size={13} className="text-muted-foreground flex-shrink-0" />
        <input
          placeholder="Search…"
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none flex-1 min-w-0"
        />
      </div>
      <ThemeToggle theme={theme} onChange={setTheme} />
      <button className="relative text-muted-foreground hover:text-foreground transition-colors p-1">
        <Bell size={17} />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-primary rounded-full text-[8px] font-bold flex items-center justify-center text-primary-foreground">
          3
        </span>
      </button>
    </header>
  );
}