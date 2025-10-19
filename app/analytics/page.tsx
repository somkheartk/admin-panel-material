'use client';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import DashboardLayout from '@/components/DashboardLayout';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { usersApi } from '@/lib/api/users';
import { ordersApi } from '@/lib/api/orders';
import { productsApi } from '@/lib/api/products';

const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate monthly data for the last 6 months
      const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'];
      const monthlyRevenue = [
        { month: 'ม.ค.', รายได้: 45000, คำสั่งซื้อ: 28, ผู้ใช้ใหม่: 15 },
        { month: 'ก.พ.', รายได้: 52000, คำสั่งซื้อ: 32, ผู้ใช้ใหม่: 18 },
        { month: 'มี.ค.', รายได้: 48000, คำสั่งซื้อ: 30, ผู้ใช้ใหม่: 12 },
        { month: 'เม.ย.', รายได้: 61000, คำสั่งซื้อ: 38, ผู้ใช้ใหม่: 22 },
        { month: 'พ.ค.', รายได้: 55000, คำสั่งซื้อ: 35, ผู้ใช้ใหม่: 16 },
        { month: 'มิ.ย.', รายได้: 68000, คำสั่งซื้อ: 42, ผู้ใช้ใหม่: 25 },
      ];
      setMonthlyData(monthlyRevenue);

      // Generate category data
      const categories = [
        { name: 'อิเล็กทรอนิกส์', value: 45 },
        { name: 'เสื้อผ้า', value: 25 },
        { name: 'อาหาร', value: 15 },
        { name: 'หนังสือ', value: 10 },
        { name: 'อื่นๆ', value: 5 },
      ];
      setCategoryData(categories);

      // Generate order status data
      const orderStatus = [
        { status: 'เสร็จสิ้น', count: 125 },
        { status: 'กำลังดำเนินการ', count: 45 },
        { status: 'รอดำเนินการ', count: 28 },
        { status: 'ยกเลิก', count: 12 },
      ];
      setOrderStatusData(orderStatus);
    } catch (err: any) {
      setError('ไม่สามารถโหลดข้อมูลวิเคราะห์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth={false}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          การวิเคราะห์ข้อมูล
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Monthly Revenue Chart */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                รายได้รายเดือน
              </Typography>
              {loading ? (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  กำลังโหลด...
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="รายได้" stroke="#1976d2" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </Grid>

          {/* Category Distribution */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                การกระจายตามหมวดหมู่
              </Typography>
              {loading ? (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  กำลังโหลด...
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name} ${entry.value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </Grid>

          {/* Orders and Users Trend */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                แนวโน้มคำสั่งซื้อและผู้ใช้ใหม่
              </Typography>
              {loading ? (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  กำลังโหลด...
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="คำสั่งซื้อ" stroke="#2e7d32" strokeWidth={2} />
                    <Line type="monotone" dataKey="ผู้ใช้ใหม่" stroke="#ed6c02" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </Grid>

          {/* Order Status Distribution */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                สถานะคำสั่งซื้อ
              </Typography>
              {loading ? (
                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  กำลังโหลด...
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={orderStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#1976d2" name="จำนวน" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}
