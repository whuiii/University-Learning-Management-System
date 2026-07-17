import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { Database, RefreshCw, CheckCircle } from 'lucide-react';
import { serif } from '../../utils/helpers';

export function AdminSISIntegration() {
  const [config, setConfig] = useState({
    enabled: true,
    apiUrl: 'https://sis.utp.edu.my/api',
    syncFrequency: 'daily',
    lastSync: '2025-07-12 08:30 AM',
    syncStatus: 'success',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
          SIS Integration
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Connect to the Student Information System</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integration Settings</CardTitle>
          <CardDescription>Configure the SIS integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Integration</p>
              <p className="text-sm text-muted-foreground">Sync data with SIS</p>
            </div>
            <Switch checked={config.enabled} />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="api-url">API URL</Label>
            <Input id="api-url" value={config.apiUrl} onChange={(e) => setConfig({...config, apiUrl: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sync-frequency">Sync Frequency</Label>
            <select id="sync-frequency" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <Separator />
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Last Sync:</span>
            <span className="font-mono">{config.lastSync}</span>
            {config.syncStatus === 'success' && <CheckCircle size={14} className="text-emerald-500" />}
          </div>
          <Button><RefreshCw size={14} className="mr-2" /> Sync Now</Button>
        </CardContent>
      </Card>
    </div>
  );
}