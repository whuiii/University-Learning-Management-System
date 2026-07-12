import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { serif } from '../../utils/helpers';
import { User, Bell, Shield, Moon, Save, Clock, Users, Mail, Circle } from 'lucide-react';

// ─── Status options ───────────────────────────────────────────
const statusOptions = [
  { value: 'available', label: 'Available', color: '#22c55e' },
  { value: 'busy', label: 'Busy', color: '#ef4444' },
  { value: 'meeting', label: 'In a Meeting', color: '#f59e0b' },
  { value: 'away', label: 'Away', color: '#8b8b8b' },
  { value: 'dnd', label: 'Do Not Disturb', color: '#dc2626' },
];

export function LecturerSettings() {
  const { user, role } = useAuth();
  const { theme, setTheme } = useTheme();

  // ─── Profile ──────────────────────────────────────────────
  const [profile, setProfile] = useState({
    name: user || 'Dr. Sarah Chen',
    email: 'sarah.chen@utn.edu.my',
    staffId: 'LEC20241001',
    department: 'Computer Science',
    title: 'Senior Lecturer',
    office: 'Room 301, Science Tower',
  });

  // ─── Status ──────────────────────────────────────────────
  const [status, setStatus] = useState('available');

  // ─── Notifications ────────────────────────────────────────
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    studentSubmissions: true,
    gradeNotifications: true,
    announcementAlerts: true,
    systemUpdates: true,
    courseEnrollmentAlerts: true,
  });

  // ─── Security ─────────────────────────────────────────────
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '30min',
    requireApproval: true,
  });

  // ─── Office Hours ──────────────────────────────────────────
  const [officeHours, setOfficeHours] = useState({
    monday: { start: '09:00', end: '12:00', enabled: true },
    tuesday: { start: '13:00', end: '16:00', enabled: true },
    wednesday: { start: '09:00', end: '12:00', enabled: false },
    thursday: { start: '13:00', end: '16:00', enabled: true },
    friday: { start: '09:00', end: '12:00', enabled: false },
  });

  // ─── Handlers ──────────────────────────────────────────────
  const handleProfileSave = () => {
    toast.success('Profile updated successfully!');
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.info(`${key.replace(/([A-Z])/g, ' $1')} preference updated`);
  };

  const handleOfficeHoursChange = (day: string, field: 'start' | 'end' | 'enabled', value: any) => {
    setOfficeHours((prev) => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof officeHours], [field]: value },
    }));
  };

  const saveOfficeHours = () => {
    toast.success('Office hours saved successfully');
  };

  const currentStatus = statusOptions.find(s => s.value === status);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile, status, notifications, security, and office hours
        </p>
      </div>

      {/* ─── Profile & Status Card ────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Profile & Status</CardTitle>
          <CardDescription>Your personal information and current availability.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="text-2xl">SC</AvatarFallback>
              </Avatar>
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card flex items-center justify-center"
                style={{ backgroundColor: currentStatus?.color || '#22c55e' }}
              >
                <Circle size={10} className="text-white fill-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-lg">{profile.name}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{profile.title}</span>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span>{profile.email}</span>
                <span>•</span>
                <span>{profile.department}</span>
              </div>
            </div>
            <Button variant="outline" size="sm">Change Photo</Button>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="status">Current Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status" className="w-full sm:w-48">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        {s.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleProfileSave}>
                <Save size={14} className="mr-2" /> Save Profile
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staffId">Staff ID</Label>
              <Input id="staffId" value={profile.staffId} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={profile.department} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Academic Title</Label>
              <Input
                id="title"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="office">Office</Label>
              <Input
                id="office"
                value={profile.office}
                onChange={(e) => setProfile({ ...profile, office: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Notifications ────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={18} className="text-primary" /> Notifications
          </CardTitle>
          <CardDescription>Choose what updates you'd like to receive as a lecturer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Updates</p>
              <p className="text-sm text-muted-foreground">Receive system and academic emails</p>
            </div>
            <Switch
              checked={notifications.emailUpdates}
              onCheckedChange={() => handleNotificationChange('emailUpdates')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Student Submissions</p>
              <p className="text-sm text-muted-foreground">Alert when students submit assignments</p>
            </div>
            <Switch
              checked={notifications.studentSubmissions}
              onCheckedChange={() => handleNotificationChange('studentSubmissions')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Grade Notifications</p>
              <p className="text-sm text-muted-foreground">Alerts when grade entry is pending</p>
            </div>
            <Switch
              checked={notifications.gradeNotifications}
              onCheckedChange={() => handleNotificationChange('gradeNotifications')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Announcement Alerts</p>
              <p className="text-sm text-muted-foreground">Course and university announcements</p>
            </div>
            <Switch
              checked={notifications.announcementAlerts}
              onCheckedChange={() => handleNotificationChange('announcementAlerts')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">System Updates</p>
              <p className="text-sm text-muted-foreground">Platform maintenance and updates</p>
            </div>
            <Switch
              checked={notifications.systemUpdates}
              onCheckedChange={() => handleNotificationChange('systemUpdates')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Course Enrollment Alerts</p>
              <p className="text-sm text-muted-foreground">When students enroll/drop your courses</p>
            </div>
            <Switch
              checked={notifications.courseEnrollmentAlerts}
              onCheckedChange={() => handleNotificationChange('courseEnrollmentAlerts')}
            />
          </div>
          <Button onClick={() => toast.success('Notification preferences saved')}>
            <Save size={14} className="mr-2" /> Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* ─── Security ────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={18} className="text-primary" /> Security
          </CardTitle>
          <CardDescription>Manage your account security and authentication.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Switch
              checked={security.twoFactor}
              onCheckedChange={() =>
                setSecurity({ ...security, twoFactor: !security.twoFactor })
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Require Approval for Enrollment</p>
              <p className="text-sm text-muted-foreground">Manually approve student enrollment requests</p>
            </div>
            <Switch
              checked={security.requireApproval}
              onCheckedChange={() =>
                setSecurity({ ...security, requireApproval: !security.requireApproval })
              }
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout</Label>
            <select
              id="sessionTimeout"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={security.sessionTimeout}
              onChange={(e) =>
                setSecurity({ ...security, sessionTimeout: e.target.value })
              }
            >
              <option value="15min">15 minutes</option>
              <option value="30min">30 minutes</option>
              <option value="1hour">1 hour</option>
              <option value="4hours">4 hours</option>
              <option value="8hours">8 hours</option>
            </select>
          </div>
          <Separator />
          <div>
            <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10">
              Change Password
            </Button>
          </div>
          <Button onClick={() => toast.success('Security settings saved')}>
            <Save size={14} className="mr-2" /> Save Security Settings
          </Button>
        </CardContent>
      </Card>

      {/* ─── Office Hours ────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={18} className="text-primary" /> Office Hours
          </CardTitle>
          <CardDescription>
            Set your availability for student consultations. Students will see these times.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {Object.entries(officeHours).map(([day, hours]) => (
              <div key={day} className="flex items-center gap-4 flex-wrap">
                <div className="w-24 font-medium capitalize">{day}</div>
                <Switch
                  checked={hours.enabled}
                  onCheckedChange={(checked) =>
                    handleOfficeHoursChange(day, 'enabled', checked)
                  }
                />
                {hours.enabled && (
                  <>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">From</Label>
                      <Input
                        type="time"
                        className="w-24 h-8"
                        value={hours.start}
                        onChange={(e) =>
                          handleOfficeHoursChange(day, 'start', e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">To</Label>
                      <Input
                        type="time"
                        className="w-24 h-8"
                        value={hours.end}
                        onChange={(e) =>
                          handleOfficeHoursChange(day, 'end', e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <Button onClick={saveOfficeHours}>
            <Save size={14} className="mr-2" /> Save Office Hours
          </Button>
        </CardContent>
      </Card>

      {/* ─── Appearance ──────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon size={18} className="text-primary" /> Appearance
          </CardTitle>
          <CardDescription>Switch between Dark, Light, and Eye Care modes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {['dark', 'light', 'eye'].map((t) => (
              <Button
                key={t}
                variant={theme === t ? 'default' : 'outline'}
                onClick={() => setTheme(t as any)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}