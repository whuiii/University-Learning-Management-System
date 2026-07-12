import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Search, Download, Filter } from 'lucide-react';
import { serif } from '../../utils/helpers';

const mockLogs = [
  { id: 1, user: 'admin@utn.edu.my', action: 'User Login', resource: 'User: ahmed', timestamp: '2025-07-13 09:15 AM', status: 'success' },
  { id: 2, user: 'sarah.chen@utn.edu.my', action: 'Grade Update', resource: 'CS201 Assignment 1', timestamp: '2025-07-13 08:45 AM', status: 'success' },
  { id: 3, user: 'user@utn.edu.my', action: 'Password Reset', resource: 'User: alice', timestamp: '2025-07-13 08:20 AM', status: 'failure' },
  { id: 4, user: 'admin@utn.edu.my', action: 'Role Update', resource: 'Role: Lecturer', timestamp: '2025-07-12 05:30 PM', status: 'success' },
];

export function AdminAuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
          Audit Logs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Track system activity and user actions</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input placeholder="Search logs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
            </div>
            <Button variant="outline"><Filter size={14} className="mr-2" /> Filter</Button>
            <Button variant="outline"><Download size={14} className="mr-2" /> Export</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Recent system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">{log.timestamp}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.resource}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'success' ? 'outline' : 'destructive'} className="text-xs">
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}