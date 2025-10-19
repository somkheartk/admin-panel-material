'use client';
import React, { useState, useEffect } from 'react';
import { Container, Grid, Alert } from '@mui/material';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import RevenueChart from '@/components/RevenueChart';
import RecentActivity from '@/components/RecentActivity';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { usersApi } from '@/lib/api/users';
import { ordersApi } from '@/lib/api/orders';

export default function Home() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
    growth: 23.5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersCount, ordersCount, revenue] = await Promise.all([
        usersApi.getCount(),
        ordersApi.getCount(),
        ordersApi.getRevenue(),
      ]);
      setStats({
        totalUsers: usersCount,
        totalOrders: ordersCount,
        revenue: revenue,
        growth: 23.5,
      });
    } catch (err: any) {
      setError('ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่อกับ Backend');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth={false} disableGutters>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="จำนวนผู้ใช้ทั้งหมด"
              value={loading ? '...' : stats.totalUsers.toLocaleString('th-TH')}
              icon={<PeopleIcon />}
              trend={12.5}
              iconBgColor="primary.main"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="คำสั่งซื้อทั้งหมด"
              value={loading ? '...' : stats.totalOrders.toLocaleString('th-TH')}
              icon={<ShoppingCartIcon />}
              trend={8.2}
              iconBgColor="success.main"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="รายได้"
              value={loading ? '...' : `฿${stats.revenue.toLocaleString('th-TH')}`}
              icon={<AttachMoneyIcon />}
              trend={15.3}
              iconBgColor="info.main"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="การเติบโต"
              value={`${stats.growth}%`}
              icon={<TrendingUpIcon />}
              trend={4.1}
              iconBgColor="warning.main"
            />
          </Grid>

          {/* Revenue Chart */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <RevenueChart />
          </Grid>

          {/* Recent Activity */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <RecentActivity />
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}
