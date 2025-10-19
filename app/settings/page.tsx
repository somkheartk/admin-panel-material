'use client';
import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import DashboardLayout from '@/components/DashboardLayout';
import SaveIcon from '@mui/icons-material/Save';

export default function SettingsPage() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Admin Panel Material',
    siteUrl: 'https://admin.example.com',
    adminEmail: 'admin@example.com',
    language: 'th',
    timezone: 'Asia/Bangkok',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    orderNotifications: true,
    userNotifications: true,
    systemAlerts: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
  });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneralSettings({
      ...generalSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: e.target.checked,
    });
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : Number(e.target.value);
    setSecuritySettings({
      ...securitySettings,
      [e.target.name]: value,
    });
  };

  const handleSaveGeneral = () => {
    try {
      // In a real app, this would save to backend
      console.log('Saving general settings:', generalSettings);
      setSuccess('บันทึกการตั้งค่าทั่วไปสำเร็จ');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('ไม่สามารถบันทึกการตั้งค่าได้');
    }
  };

  const handleSaveNotifications = () => {
    try {
      console.log('Saving notification settings:', notificationSettings);
      setSuccess('บันทึกการตั้งค่าการแจ้งเตือนสำเร็จ');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('ไม่สามารถบันทึกการตั้งค่าได้');
    }
  };

  const handleSaveSecurity = () => {
    try {
      console.log('Saving security settings:', securitySettings);
      setSuccess('บันทึกการตั้งค่าความปลอดภัยสำเร็จ');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('ไม่สามารถบันทึกการตั้งค่าได้');
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          การตั้งค่าระบบ
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* General Settings */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                การตั้งค่าทั่วไป
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  name="siteName"
                  label="ชื่อเว็บไซต์"
                  value={generalSettings.siteName}
                  onChange={handleGeneralChange}
                  fullWidth
                />
                <TextField
                  name="siteUrl"
                  label="URL เว็บไซต์"
                  value={generalSettings.siteUrl}
                  onChange={handleGeneralChange}
                  fullWidth
                />
                <TextField
                  name="adminEmail"
                  label="อีเมลผู้ดูแลระบบ"
                  type="email"
                  value={generalSettings.adminEmail}
                  onChange={handleGeneralChange}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel>ภาษา</InputLabel>
                  <Select
                    name="language"
                    value={generalSettings.language}
                    label="ภาษา"
                    onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                  >
                    <MenuItem value="th">ไทย</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>เขตเวลา</InputLabel>
                  <Select
                    name="timezone"
                    value={generalSettings.timezone}
                    label="เขตเวลา"
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                  >
                    <MenuItem value="Asia/Bangkok">Bangkok (GMT+7)</MenuItem>
                    <MenuItem value="Asia/Tokyo">Tokyo (GMT+9)</MenuItem>
                    <MenuItem value="America/New_York">New York (GMT-5)</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveGeneral}
                  >
                    บันทึก
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Notification Settings */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                การตั้งค่าการแจ้งเตือน
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange('emailNotifications')}
                    />
                  }
                  label="การแจ้งเตือนทางอีเมล"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onChange={handleNotificationChange('pushNotifications')}
                    />
                  }
                  label="การแจ้งเตือนแบบ Push"
                />
                <Divider sx={{ my: 1 }} />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.orderNotifications}
                      onChange={handleNotificationChange('orderNotifications')}
                    />
                  }
                  label="แจ้งเตือนคำสั่งซื้อใหม่"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.userNotifications}
                      onChange={handleNotificationChange('userNotifications')}
                    />
                  }
                  label="แจ้งเตือนผู้ใช้ใหม่"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.systemAlerts}
                      onChange={handleNotificationChange('systemAlerts')}
                    />
                  }
                  label="แจ้งเตือนระบบ"
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveNotifications}
                  >
                    บันทึก
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Security Settings */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                การตั้งค่าความปลอดภัย
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onChange={handleSecurityChange}
                    />
                  }
                  label="การยืนยันตัวตนแบบสองขั้นตอน (2FA)"
                />
                <TextField
                  name="sessionTimeout"
                  label="หมดเวลาเซสชัน (นาที)"
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={handleSecurityChange}
                  fullWidth
                />
                <TextField
                  name="passwordExpiry"
                  label="ระยะเวลาหมดอายุรหัสผ่าน (วัน)"
                  type="number"
                  value={securitySettings.passwordExpiry}
                  onChange={handleSecurityChange}
                  fullWidth
                />
                <TextField
                  name="loginAttempts"
                  label="จำนวนครั้งที่พยายามเข้าสู่ระบบสูงสุด"
                  type="number"
                  value={securitySettings.loginAttempts}
                  onChange={handleSecurityChange}
                  fullWidth
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveSecurity}
                  >
                    บันทึก
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}
