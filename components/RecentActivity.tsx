'use client';
import React from 'react';
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
  Chip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const activities = [
  {
    id: 1,
    title: 'New user registered',
    description: 'John Doe joined the platform',
    time: '5 minutes ago',
    icon: <PersonIcon />,
    color: 'primary.main',
  },
  {
    id: 2,
    title: 'New order received',
    description: 'Order #12345 from Jane Smith',
    time: '10 minutes ago',
    icon: <ShoppingBagIcon />,
    color: 'success.main',
  },
  {
    id: 3,
    title: 'Payment processed',
    description: 'Payment of $299.99 completed',
    time: '30 minutes ago',
    icon: <PaymentIcon />,
    color: 'info.main',
  },
  {
    id: 4,
    title: 'Order shipped',
    description: 'Order #12340 is on its way',
    time: '1 hour ago',
    icon: <LocalShippingIcon />,
    color: 'warning.main',
  },
];

export default function RecentActivity() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Recent Activity
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Latest updates and activities
        </Typography>
        <List sx={{ pt: 0 }}>
          {activities.map((activity, index) => (
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
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
