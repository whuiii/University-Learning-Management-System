import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Plus, Trash2, Edit, Calendar } from 'lucide-react';
import { serif } from '../../utils/helpers';

const mockSemesters = [
  { id: 's1', name: '2024/25 Sem 1', start: '2024-09-01', end: '2025-01-15', active: false },
  { id: 's2', name: '2024/25 Sem 2', start: '2025-02-01', end: '2025-06-15', active: true },
  { id: 's3', name: '2025/26 Sem 1', start: '2025-09-01', end: '2026-01-15', active: false },
];

export function AdminSemesters() {
  const [semesters, setSemesters] = useState(mockSemesters);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
            Semester Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage academic semesters</p>
        </div>
        <Button><Plus size={14} className="mr-2" /> New Semester</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Semesters</CardTitle>
          <CardDescription>All semesters in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {semesters.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.start}</TableCell>
                    <TableCell>{s.end}</TableCell>
                    <TableCell>
                      {s.active ? <Badge>Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost"><Edit size={14} /></Button>
                      <Button size="sm" variant="ghost" className="text-red-500"><Trash2 size={14} /></Button>
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