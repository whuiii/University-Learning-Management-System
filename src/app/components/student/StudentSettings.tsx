import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { serif } from '../../utils/helpers';
import { User, Bell, Shield, Moon, Save, Mail, Clock, AlertCircle } from 'lucide-react';

export function StudentSettings() {
  const { user, role } = useAuth();
  const { theme, setTheme } = useTheme();

  // Profile state (mock)
  const [profile, setProfile] = useState({
    name: user || 'Ahmad Fariz',
    email: 'ahmad.fariz@utn.edu.my',
    studentId: 'STU20241234',
    program: 'Computer Science (3rd Year)',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    assignmentReminders: true,
    gradeNotifications: true,
    announcementAlerts: true,
    marketingEmails: false,
  });

  // Security
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '30min',
  });

  const handleProfileSave = () => {
    toast.success('Profile updated successfully!');
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.info(`${key.replace(/([A-Z])/g, ' $1')} preference updated`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account preferences and security
        </p>
      </div>

      {/* ─── Profile Section ────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User size={18} className="text-primary" />
            <CardTitle>Profile Information</CardTitle>
          </div>
          <CardDescription>
            Update your personal details and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="text-2xl">AF</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">Change Photo</Button>
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
              <Label htmlFor="studentId">Student ID</Label>
              <Input id="studentId" value={profile.studentId} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Input id="program" value={profile.program} disabled />
            </div>
          </div>
          <Button onClick={handleProfileSave} className="w-full md:w-auto">
            <Save size={14} className="mr-2" /> Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* ─── Notifications Section ────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            <CardTitle>Notification Preferences</CardTitle>
          </div>
          <CardDescription>
            Choose what updates you'd like to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Updates</p>
                <p className="text-sm text-muted-foreground">
                  Receive system and academic emails
                </p>
              </div>
              <Switch
                checked={notifications.emailUpdates}
                onCheckedChange={() => handleNotificationChange('emailUpdates')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Assignment Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Get reminders before assignment deadlines
                </p>
              </div>
              <Switch
                checked={notifications.assignmentReminders}
                onCheckedChange={() => handleNotificationChange('assignmentReminders')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Grade Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Alerts when new grades are posted
                </p>
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
                <p className="text-sm text-muted-foreground">
                  Course and university announcements
                </p>
              </div>
              <Switch
                checked={notifications.announcementAlerts}
                onCheckedChange={() => handleNotificationChange('announcementAlerts')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">
                  Updates, events, and offers
                </p>
              </div>
              <Switch
                checked={notifications.marketingEmails}
                onCheckedChange={() => handleNotificationChange('marketingEmails')}
              />
            </div>
          </div>
          <Button onClick={() => toast.success('Notification preferences saved')}>
            <Save size={14} className="mr-2" /> Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* ─── Security Section ────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-primary" />
            <CardTitle>Security Settings</CardTitle>
          </div>
          <CardDescription>
            Manage your account security and authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={security.twoFactor}
              onCheckedChange={() =>
                setSecurity({ ...security, twoFactor: !security.twoFactor })
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

      {/* ─── Appearance Section ───────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Moon size={18} className="text-primary" />
            <CardTitle>Appearance</CardTitle>
          </div>
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