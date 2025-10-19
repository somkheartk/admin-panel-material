'use client';
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  iconBgColor?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  iconBgColor = 'primary.main' 
}: StatCardProps) {
  const { t } = useLanguage();
  const isPositiveTrend = trend && trend > 0;
  const isNegativeTrend = trend && trend < 0;

  return (
    <Card 
      sx={{ 
        height: '100%',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: iconBgColor,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
        
        {trend !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isPositiveTrend && (
              <>
                <TrendingUpIcon fontSize="small" sx={{ color: 'success.main' }} />
                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                  +{trend}%
                </Typography>
              </>
            )}
            {isNegativeTrend && (
              <>
                <TrendingDownIcon fontSize="small" sx={{ color: 'error.main' }} />
                <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
                  {trend}%
                </Typography>
              </>
            )}
            {!isPositiveTrend && !isNegativeTrend && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('dashboard.noChange')}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              {t('dashboard.fromLastMonth')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
