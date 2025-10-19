'use client';
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { usersApi, User } from '@/lib/api/users';
import { ordersApi, Order } from '@/lib/api/orders';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function RecentActivity() {
  const { t, language } = useLanguage();
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    loadActivities();
  }, [language]); // Reload when language changes

  const loadActivities = async () => {
    try {
      const [users, orders] = await Promise.all([
        usersApi.getAll(),
        ordersApi.getAll(),
      ]);

      const recentUsers = users.slice(0, 2).map((user: User) => ({
        id: `user-${user._id}`,
        title: t('dashboard.newUser'),
        description: user.name,
        time: formatTime(user.createdAt),
        icon: <PersonIcon />,
        color: 'primary.main',
      }));

      const recentOrders = orders.slice(0, 3).map((order: Order) => ({
        id: `order-${order._id}`,
        title: t('dashboard.newOrder'),
        description: `${order.orderNumber} - ${order.customerName}`,
        time: formatTime(order.createdAt),
        icon: <ShoppingBagIcon />,
        color: 'success.main',
      }));

      const allActivities = [...recentOrders, ...recentUsers]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);

      setActivities(allActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} ${t('dashboard.minutesAgo')}`;
    } else if (diffHours < 24) {
      return `${diffHours} ${t('dashboard.hoursAgo')}`;
    } else {
      return `${diffDays} ${t('dashboard.daysAgo')}`;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {t('dashboard.recentActivity')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('dashboard.recentUpdates')}
        </Typography>
        <List sx={{ pt: 0 }}>
          {activities.length === 0 ? (
            <ListItem sx={{ px: 0 }}>
              <ListItemText primary={t('dashboard.noActivity')} />
            </ListItem>
          ) : (
            activities.map((activity, index) => (
              <ListItem
                key={activity.id}
                sx={{
                  px: 0,
                  borderBottom: index < activities.length - 1 ? 1 : 0,
                  borderColor: 'divider',
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: activity.color }}>
                    {activity.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight={600}>
                      {activity.title}
                    </Typography>
                  }
                  secondary={
                    <Box component="span">
                      <Typography variant="body2" color="text.secondary" component="span" display="block">
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" component="span">
                        {activity.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );
}
