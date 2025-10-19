'use client';
import React from 'react';
import { Container, Grid } from '@mui/material';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import RevenueChart from '@/components/RevenueChart';
import RecentActivity from '@/components/RecentActivity';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function Home() {
  return (
    <DashboardLayout>
      <Container maxWidth={false} disableGutters>
        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Total Users"
              value="2,543"
              icon={<PeopleIcon />}
              trend={12.5}
              iconBgColor="primary.main"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Total Orders"
              value="1,234"
              icon={<ShoppingCartIcon />}
              trend={8.2}
              iconBgColor="success.main"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Revenue"
              value="$45,678"
              icon={<AttachMoneyIcon />}
              trend={15.3}
              iconBgColor="info.main"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="Growth"
              value="23.5%"
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
