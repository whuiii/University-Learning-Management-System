import { useState, useEffect, useRef } from 'react';
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
import {
  User,
  Bell,
  Shield,
  Moon,
  Save,
  Mail,
  Clock,
  AlertCircle,
  Edit,
  X,
  Check,
  Camera,
  Trash2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────
interface ProfileData {
  name: string;
  email: string;
  studentId: string;
  program: string;
  photo?: string; // base64 data URL
}

interface NotificationPrefs {
  emailUpdates: boolean;
  assignmentReminders: boolean;
  gradeNotifications: boolean;
  announcementAlerts: boolean;
  marketingEmails: boolean;
}

interface SecurityData {
  twoFactor: boolean;
  sessionTimeout: string;
}

// ─── Defaults ────────────────────────────────────────────────
const defaultProfile: ProfileData = {
  name: 'Ahmad Fariz',
  email: 'ahmad.fariz@utp.edu.my',
  studentId: 'STU20241234',
  program: 'Computer Science (3rd Year)',
  photo: '',
};

const defaultNotifications: NotificationPrefs = {
  emailUpdates: true,
  assignmentReminders: true,
  gradeNotifications: true,
  announcementAlerts: true,
  marketingEmails: false,
};

const defaultSecurity: SecurityData = {
  twoFactor: false,
  sessionTimeout: '30min',
};

const STORAGE_KEY = 'student_settings';

function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        profile: { ...defaultProfile, ...parsed.profile },
        notifications: { ...defaultNotifications, ...parsed.notifications },
        security: { ...defaultSecurity, ...parsed.security },
      };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return { profile: defaultProfile, notifications: defaultNotifications, security: defaultSecurity };
}

function saveSettings(profile: ProfileData, notifications: NotificationPrefs, security: SecurityData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, notifications, security }));
}

// ─── Component ────────────────────────────────────────────────
export function StudentSettings() {
  const { user, role } = useAuth();
  const { theme, setTheme } = useTheme();

  // ─── State ──────────────────────────────────────────────────
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [notifications, setNotifications] = useState<NotificationPrefs>(defaultNotifications);
  const [security, setSecurity] = useState<SecurityData>(defaultSecurity);

  // Edit mode flags
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingNotifications, setEditingNotifications] = useState(false);
  const [editingSecurity, setEditingSecurity] = useState(false);

  // Photo upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Load from localStorage on mount ──────────────────────
  useEffect(() => {
    const data = loadSettings();
    setProfile(data.profile);
    setNotifications(data.notifications);
    setSecurity(data.security);
  }, []);

  // ─── Photo upload handlers ─────────────────────────────────
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setProfile((prev) => ({ ...prev, photo: dataUrl }));
      // Auto-save the photo immediately
      saveSettings({ ...profile, photo: dataUrl }, notifications, security);
      toast.success('Photo updated successfully!');
    };
    reader.onerror = () => {
      toast.error('Failed to read the image file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfile((prev) => ({ ...prev, photo: '' }));
    saveSettings({ ...profile, photo: '' }, notifications, security);
    toast.info('Photo removed');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // ─── Profile Handlers ──────────────────────────────────────
  const handleProfileEdit = () => {
    setEditingProfile(true);
  };

  const handleProfileCancel = () => {
    const data = loadSettings();
    setProfile(data.profile);
    setEditingProfile(false);
  };

  const handleProfileSave = () => {
    saveSettings(profile, notifications, security);
    setEditingProfile(false);
    toast.success('Profile updated successfully!');
  };

  // ─── Notification Handlers ────────────────────────────────
  const handleNotifEdit = () => {
    setEditingNotifications(true);
  };

  const handleNotifCancel = () => {
    const data = loadSettings();
    setNotifications(data.notifications);
    setEditingNotifications(false);
  };

  const handleNotifSave = () => {
    saveSettings(profile, notifications, security);
    setEditingNotifications(false);
    toast.success('Notification preferences saved');
  };

  const handleNotificationToggle = (key: keyof NotificationPrefs) => {
    if (!editingNotifications) return;
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ─── Security Handlers ────────────────────────────────────
  const handleSecurityEdit = () => {
    setEditingSecurity(true);
  };

  const handleSecurityCancel = () => {
    const data = loadSettings();
    setSecurity(data.security);
    setEditingSecurity(false);
  };

  const handleSecuritySave = () => {
    saveSettings(profile, notifications, security);
    setEditingSecurity(false);
    toast.success('Security settings saved');
  };

  // ─── Theme toggle ──────────────────────────────────────────
  const handleThemeChange = (newTheme: 'dark' | 'light' | 'eye') => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`);
  };

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-6">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={18} className="text-primary" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            {!editingProfile ? (
              <Button variant="outline" size="sm" onClick={handleProfileEdit}>
                <Edit size={14} className="mr-2" /> Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleProfileCancel}>
                  <X size={14} className="mr-1" /> Cancel
                </Button>
                <Button size="sm" onClick={handleProfileSave}>
                  <Check size={14} className="mr-1" /> Save
                </Button>
              </div>
            )}
          </div>
          <CardDescription>
            {editingProfile ? 'Edit your personal details.' : 'Your personal information.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ─── Avatar ────────────────────────────────────────── */}
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 border-2 border-border transition-all duration-200 group-hover:border-primary/50">
                <AvatarImage src={profile.photo || ''} />
                <AvatarFallback className="text-2xl font-light bg-primary/5 text-primary">
                  {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* ── Overlay – only appears when editing ── */}
              {editingProfile && (
                <div
                  className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <Camera size={24} className="text-white" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
                disabled={!editingProfile}
              />
            </div>
            {/* ── Upload buttons – only visible when editing ── */}
            {editingProfile && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={triggerFileInput}
                    className="gap-2"
                  >
                    <Camera size={14} /> Upload Photo
                  </Button>
                  {profile.photo && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemovePhoto}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 gap-1"
                    >
                      <Trash2 size={14} /> Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 2MB
                </p>
              </div>
            )}
            {/* ── Show a small hint when not editing ── */}
            {!editingProfile && profile.photo && (
              <p className="text-sm text-muted-foreground">
                Photo uploaded. Click <strong>Edit</strong> to change it.
              </p>
            )}
          </div>

          {/* ─── Profile fields ────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!editingProfile}
                className={!editingProfile ? 'bg-muted' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!editingProfile}
                className={!editingProfile ? 'bg-muted' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input id="studentId" value={profile.studentId} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Input id="program" value={profile.program} disabled className="bg-muted" />
            </div>
          </div>
          {editingProfile && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle size={12} className="inline" />
              Student ID and Program cannot be changed. Contact support if needed.
            </p>
          )}
        </CardContent>
      </Card>

      {/* ─── Notifications Section ────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
            {!editingNotifications ? (
              <Button variant="outline" size="sm" onClick={handleNotifEdit}>
                <Edit size={14} className="mr-2" /> Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleNotifCancel}>
                  <X size={14} className="mr-1" /> Cancel
                </Button>
                <Button size="sm" onClick={handleNotifSave}>
                  <Check size={14} className="mr-1" /> Save
                </Button>
              </div>
            )}
          </div>
          <CardDescription>
            {editingNotifications
              ? 'Toggle switches to update your preferences.'
              : 'Manage your notification settings.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => {
              const labelMap: Record<string, { label: string; desc: string }> = {
                emailUpdates: { label: 'Email Updates', desc: 'Receive system and academic emails' },
                assignmentReminders: { label: 'Assignment Reminders', desc: 'Get reminders before assignment deadlines' },
                gradeNotifications: { label: 'Grade Notifications', desc: 'Alerts when new grades are posted' },
                announcementAlerts: { label: 'Announcement Alerts', desc: 'Course and university announcements' },
                marketingEmails: { label: 'Marketing Emails', desc: 'Updates, events, and offers' },
              };
              const info = labelMap[key];
              if (!info) return null;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{info.label}</p>
                      <p className="text-sm text-muted-foreground">{info.desc}</p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={() => handleNotificationToggle(key as keyof NotificationPrefs)}
                      disabled={!editingNotifications}
                      className={!editingNotifications ? 'opacity-70' : ''}
                    />
                  </div>
                  <Separator className="mt-4" />
                </div>
              );
            })}
          </div>
          {editingNotifications && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle size={12} className="inline" />
              Changes will be saved when you click Save.
            </p>
          )}
        </CardContent>
      </Card>

      {/* ─── Security Section ────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-primary" />
              <CardTitle>Security Settings</CardTitle>
            </div>
            {!editingSecurity ? (
              <Button variant="outline" size="sm" onClick={handleSecurityEdit}>
                <Edit size={14} className="mr-2" /> Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleSecurityCancel}>
                  <X size={14} className="mr-1" /> Cancel
                </Button>
                <Button size="sm" onClick={handleSecuritySave}>
                  <Check size={14} className="mr-1" /> Save
                </Button>
              </div>
            )}
          </div>
          <CardDescription>
            {editingSecurity
              ? 'Update your security preferences.'
              : 'Your current security settings.'}
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
              onCheckedChange={(checked) =>
                setSecurity({ ...security, twoFactor: checked })
              }
              disabled={!editingSecurity}
              className={!editingSecurity ? 'opacity-70' : ''}
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout</Label>
            <select
              id="sessionTimeout"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-60"
              value={security.sessionTimeout}
              onChange={(e) =>
                setSecurity({ ...security, sessionTimeout: e.target.value })
              }
              disabled={!editingSecurity}
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
            <Button
              variant="outline"
              className="text-red-500 border-red-500/20 hover:bg-red-500/10"
              disabled={!editingSecurity}
            >
              Change Password
            </Button>
          </div>
          {editingSecurity && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertCircle size={12} className="inline" />
              Click Save to apply changes.
            </p>
          )}
        </CardContent>
      </Card>

    </div>
  );
}