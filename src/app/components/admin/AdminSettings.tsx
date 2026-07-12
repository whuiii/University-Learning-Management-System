import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, Moon, Bell, Shield, Globe } from 'lucide-react';
import { serif } from '../../utils/helpers';

export function AdminSettings() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    systemAlerts: true,
    autoBackup: true,
    language: 'en',
    timezone: 'Asia/Kuala_Lumpur',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage system-wide settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic system configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <select id="language" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="en">English</option>
              <option value="ms">Malay</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select id="timezone" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="Asia/Kuala_Lumpur">Kuala Lumpur (UTC+8)</option>
              <option value="Asia/Singapore">Singapore (UTC+8)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>System notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Email Notifications</p><p className="text-sm text-muted-foreground">Receive system emails</p></div>
            <Switch checked={settings.emailNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><p className="font-medium">System Alerts</p><p className="text-sm text-muted-foreground">Critical system alerts</p></div>
            <Switch checked={settings.systemAlerts} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><p className="font-medium">Auto Backup</p><p className="text-sm text-muted-foreground">Automatic daily backups</p></div>
            <Switch checked={settings.autoBackup} />
          </div>
          <Button className="mt-2">Save Preferences</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Switch between Dark, Light, and Eye Care modes</CardDescription>
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