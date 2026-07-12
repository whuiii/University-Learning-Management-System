import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Shield, Key, Lock, Fingerprint } from 'lucide-react';
import { serif } from '../../utils/helpers';

export function AdminSecurity() {
  const [settings, setSettings] = useState({
    mfaRequired: true,
    passwordComplexity: 'high',
    sessionTimeout: 30,
    ipWhitelist: '192.168.1.0/24',
    allowApiAccess: false,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
          Security & Access
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage authentication and security settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Configure security policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Multi-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Require MFA for all users</p>
            </div>
            <Switch checked={settings.mfaRequired} />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="password-complexity">Password Complexity</Label>
            <select id="password-complexity" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
            <Input id="session-timeout" type="number" value={settings.sessionTimeout} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">API Access</p>
              <p className="text-sm text-muted-foreground">Allow REST API access</p>
            </div>
            <Switch checked={settings.allowApiAccess} />
          </div>
          <Button>Save Security Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}