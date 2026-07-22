"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { Users, FileText, CheckCircle, CreditCard } from "lucide-react";

const trendData = [
  { name: "Jan", applications: 40, verified: 24 },
  { name: "Feb", applications: 60, verified: 35 },
  { name: "Mar", applications: 85, verified: 50 },
  { name: "Apr", applications: 120, verified: 80 },
  { name: "May", applications: 150, verified: 110 },
  { name: "Jun", applications: 190, verified: 150 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    pendingDocs: 0,
    pendingPayments: 0,
    verified: 0,
  });

  useEffect(() => {
    // In a real app, fetch from API: /admissions
    // Mocking for now to demonstrate layout
    setTimeout(() => {
      setStats({
        total: 190,
        pendingDocs: 45,
        pendingPayments: 20,
        verified: 125,
      });
    }, 500);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border backdrop-blur-lg hover:bg-muted transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">+20% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border backdrop-blur-lg hover:bg-muted transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Documents</CardTitle>
            <FileText className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.pendingDocs}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires admin review</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border backdrop-blur-lg hover:bg-muted transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting fee submission</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border backdrop-blur-lg hover:bg-muted transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fully Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.verified}</div>
            <p className="text-xs text-muted-foreground mt-1">Students admitted</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card border-border backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-foreground">Admission Trends</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="applications" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="verified" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-card border-border backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 mr-4">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">New Application Received</p>
                    <p className="text-sm text-muted-foreground">Rahul Sharma applied for B.Tech CSE</p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-muted-foreground">
                    {i * 15}m ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
