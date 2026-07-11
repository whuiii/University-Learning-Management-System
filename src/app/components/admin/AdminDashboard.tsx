import { Users, BookOpen, UserCheck, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { serif, mono } from '../../utils/helpers';

export function AdminDashboard() {
  const { theme } = useTheme();

  const enrollmentData = [
    { month: 'Aug', students: 6800 },
    { month: 'Sep', students: 7200 },
    { month: 'Oct', students: 7400 },
    { month: 'Nov', students: 7800 },
    { month: 'Dec', students: 7600 },
    { month: 'Jan', students: 8100 },
    { month: 'Feb', students: 8412 },
  ];

  const activityData = [
    { day: 'Mon', logins: 2100, uploads: 340 },
    { day: 'Tue', logins: 2400, uploads: 420 },
    { day: 'Wed', logins: 1900, uploads: 280 },
    { day: 'Thu', logins: 2600, uploads: 480 },
    { day: 'Fri', logins: 2200, uploads: 360 },
    { day: 'Sat', logins: 800, uploads: 120 },
    { day: 'Sun', logins: 600, uploads: 80 },
  ];

  return (
    <div className="space-y-7 max-w-6xl">
      <div>
        <p className="text-xs text-muted-foreground mb-1.5 tracking-wide">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="text-3xl font-normal text-foreground" style={{ fontFamily: serif }}>
          System Overview ⚙️
        </h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          All services operational · Last synced <span className="text-foreground font-semibold">2 minutes ago</span>
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Enrolled Students', value: '8,412', change: '+312 this month', icon: Users, color: '#4470B4' },
          { label: 'Active Courses', value: '48', change: '6 pending approval', icon: BookOpen, color: '#4A8A5C' },
          { label: 'Staff Accounts', value: '320', change: '3 new this week', icon: UserCheck, color: '#C4582A' },
          { label: 'System Uptime', value: '99.8%', change: 'SLA: 99.5% target', icon: Activity, color: '#D4A230' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/25 transition-all">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4" style={{ background: `${s.color}18` }}>
              <s.icon size={15} style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-light text-foreground mb-0.5" style={{ fontFamily: serif }}>
              {s.value}
            </p>
            <p className="text-xs font-medium text-foreground mb-1">{s.label}</p>
            <p className="text-[10px] text-muted-foreground">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-normal text-foreground mb-4" style={{ fontFamily: serif, fontSize: '1rem' }}>
            Student Enrollment Trend
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={enrollmentData}>
              <defs>
                <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4470B4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4470B4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[6000, 9000]} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: 12 }} />
              <Area type="monotone" dataKey="students" stroke="#4470B4" strokeWidth={2} fill="url(#enrollGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-normal text-foreground mb-4" style={{ fontFamily: serif, fontSize: '1rem' }}>
            Weekly Platform Activity
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={activityData} barSize={14} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: 12 }} />
              <Bar dataKey="logins" fill="#4470B4" radius={[4, 4, 0, 0]} name="Logins" />
              <Bar dataKey="uploads" fill="#4A8A5C" radius={[4, 4, 0, 0]} name="Uploads" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System status + tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-normal text-foreground mb-4 text-sm" style={{ fontFamily: serif }}>
            System Health
          </h3>
          <div className="space-y-3">
            {[
              { service: 'Web Server', status: 'Operational', uptime: '99.9%', ok: true },
              { service: 'Database', status: 'Operational', uptime: '99.8%', ok: true },
              { service: 'File Storage', status: 'Degraded', uptime: '97.2%', ok: false },
              { service: 'Email Service', status: 'Operational', uptime: '99.5%', ok: true },
              { service: 'SIS Integration', status: 'Operational', uptime: '100%', ok: true },
            ].map((s) => (
              <div key={s.service} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="text-foreground font-medium">{s.service}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground" style={{ fontFamily: mono }}>
                    {s.uptime}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                      s.ok ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-normal text-foreground text-sm" style={{ fontFamily: serif }}>
              Open Support Tickets
            </h3>
            <span className="text-[10px] bg-red-500/15 text-red-500 px-2.5 py-1 rounded-full font-semibold">7 open</span>
          </div>
          {[
            { id: '#T-1041', user: 'Siti Zulaikha (Student)', issue: 'Cannot submit Assignment 2 — portal shows error', priority: 'High', time: '1h ago' },
            { id: '#T-1040', user: 'Dr. Rashid (Lecturer)', issue: 'Grade export to Excel not working for CS401', priority: 'Medium', time: '3h ago' },
            { id: '#T-1039', user: 'Ahmad Kamal (Student)', issue: 'Forgot university email password — account locked', priority: 'Low', time: '5h ago' },
            { id: '#T-1038', user: 'Admin Registry', issue: 'New batch enrollment sync failed for 12 students', priority: 'High', time: '1d ago' },
          ].map((t, i, arr) => (
            <div
              key={t.id}
              className={`px-5 py-4 flex items-start gap-4 hover:bg-secondary/40 transition-colors cursor-pointer ${
                i < arr.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <span className="text-[10px] font-mono text-muted-foreground mt-0.5 flex-shrink-0" style={{ fontFamily: mono }}>
                {t.id}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground mb-0.5">{t.issue}</p>
                <p className="text-[10px] text-muted-foreground">{t.user} · {t.time}</p>
              </div>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded flex-shrink-0 mt-0.5 ${
                  t.priority === 'High'
                    ? 'bg-red-500/15 text-red-500'
                    : t.priority === 'Medium'
                    ? 'bg-amber-500/15 text-amber-500'
                    : 'bg-sky-500/15 text-sky-500'
                }`}
              >
                {t.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}