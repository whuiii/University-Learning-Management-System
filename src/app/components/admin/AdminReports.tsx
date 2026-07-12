import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Users, BookOpen, Clock } from 'lucide-react';
import { serif, mono } from '../../utils/helpers';

const enrollmentData = [
  { month: 'Jan', students: 8200 },
  { month: 'Feb', students: 8412 },
  { month: 'Mar', students: 8600 },
  { month: 'Apr', students: 8700 },
  { month: 'May', students: 8900 },
  { month: 'Jun', students: 9100 },
];

const courseDistribution = [
  { name: 'CS', value: 35 },
  { name: 'SE', value: 25 },
  { name: 'DS', value: 20 },
  { name: 'Other', value: 20 },
];
const COLORS = ['#4470B4', '#4A8A5C', '#C4582A', '#D4A230'];

export function AdminReports() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
            Reports & Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">View institutional analytics and reports</p>
        </div>
        <Button><Download size={14} className="mr-2" /> Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Total Students</div><div className="text-2xl font-light" style={{ fontFamily: serif }}>9,100</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Active Courses</div><div className="text-2xl font-light" style={{ fontFamily: serif }}>52</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Avg. Grade</div><div className="text-2xl font-light" style={{ fontFamily: serif }}>74%</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Engagement Rate</div><div className="text-2xl font-light" style={{ fontFamily: serif }}>86%</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Enrollment Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#4470B4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Course Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={courseDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {courseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}