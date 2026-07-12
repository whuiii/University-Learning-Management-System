import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Shield, Plus, Trash2, Edit } from 'lucide-react';
import { serif } from '../../utils/helpers';

const mockRoles = [
  { id: 'r1', name: 'Student', permissions: ['view_courses', 'submit_assignments', 'view_grades'] },
  { id: 'r2', name: 'Lecturer', permissions: ['manage_courses', 'grade_assignments', 'view_analytics'] },
  { id: 'r3', name: 'Admin', permissions: ['manage_users', 'manage_roles', 'view_audit_logs', 'manage_system'] },
];

const allPermissions = ['view_courses', 'submit_assignments', 'view_grades', 'manage_courses', 'grade_assignments', 'view_analytics', 'manage_users', 'manage_roles', 'view_audit_logs', 'manage_system'];

export function AdminRoles() {
  const [roles, setRoles] = useState(mockRoles);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
            Roles & Permissions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage system roles and their permissions</p>
        </div>
        <Button><Plus size={14} className="mr-2" /> Add Role</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role List</CardTitle>
          <CardDescription>Each role defines a set of permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((perm) => (
                          <Badge key={perm} variant="outline" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                      </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>Toggle permissions for each role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Permission</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role.id} className="text-center">{role.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPermissions.map((perm) => (
                  <TableRow key={perm}>
                    <TableCell className="font-mono text-sm">{perm}</TableCell>
                    {roles.map((role) => (
                      <TableCell key={role.id} className="text-center">
                        <Switch checked={role.permissions.includes(perm)} />
                      </TableCell>
                    ))}
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