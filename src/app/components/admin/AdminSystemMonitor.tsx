import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Server, Cpu, HardDrive, Activity, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { serif, mono } from '../../utils/helpers';

export function AdminSystemMonitor() {
  const [uptime, setUptime] = useState('14d 6h 32m');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
          System Monitor
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time system health and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><div className="flex items-center gap-2"><Server size={16} className="text-primary" /><span className="text-sm text-muted-foreground">CPU</span></div><div className="text-2xl font-light" style={{ fontFamily: serif }}>32%</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center gap-2"><HardDrive size={16} className="text-primary" /><span className="text-sm text-muted-foreground">Memory</span></div><div className="text-2xl font-light" style={{ fontFamily: serif }}>4.2 / 16 GB</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center gap-2"><Activity size={16} className="text-primary" /><span className="text-sm text-muted-foreground">Uptime</span></div><div className="text-2xl font-light" style={{ fontFamily: serif }}>{uptime}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /><span className="text-sm text-muted-foreground">Status</span></div><div><Badge className="bg-emerald-500">Operational</Badge></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
          <CardDescription>All services are operational</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Web Server', 'Database', 'File Storage', 'Email Service', 'SIS Integration'].map((service) => (
              <div key={service} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-medium">{service}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground" style={{ fontFamily: mono }}>99.9%</span>
                  <Badge variant="outline" className="text-emerald-500">Operational</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}