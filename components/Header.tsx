'use client';
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useColorScheme } from '@mui/material/styles';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useUser } from '@/lib/UserContext';

const drawerWidth = 260;

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [roleMenuAnchor, setRoleMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [switchingRole, setSwitchingRole] = React.useState(false);
  const { mode, setMode } = useColorScheme();
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, switchRole } = useUser();
  const open = Boolean(anchorEl);
  const roleMenuOpen = Boolean(roleMenuAnchor);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRoleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setRoleMenuAnchor(event.currentTarget);
  };

  const handleRoleMenuClose = () => {
    setRoleMenuAnchor(null);
  };

  const toggleColorMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  const handleSwitchRole = async (roleId: string) => {
    setSwitchingRole(true);
    try {
      console.log('Switching to role:', roleId);
      await switchRole(roleId);
      handleRoleMenuClose();
      console.log('Role switched successfully to:', roleId);
    } catch (error: any) {
      console.error('Failed to switch role:', error);
      const errorMessage = error?.response?.data?.message || error?.message || t('users.errorSwitchRole');
      alert(`${t('users.errorSwitchRole')}: ${errorMessage}`);
    } finally {
      setSwitchingRole(false);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {t('header.title')}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {currentUser && currentUser.roles && currentUser.roles.length > 1 && (
            <Button
              variant="outlined"
              size="small"
              startIcon={switchingRole ? <CircularProgress size={16} /> : <SwapHorizIcon />}
              onClick={handleRoleMenuOpen}
              disabled={switchingRole}
              sx={{ textTransform: 'none' }}
            >
              {t(`roles.${currentUser.activeRole}`)}
            </Button>
          )}

          <Button
            variant="outlined"
            size="small"
            startIcon={<LanguageIcon />}
            onClick={toggleLanguage}
            sx={{ textTransform: 'none' }}
          >
            {language === 'th' ? 'EN' : 'TH'}
          </Button>

          <IconButton color="inherit" onClick={toggleColorMode}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>

          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {currentUser?.name?.charAt(0).toUpperCase() || 'A'}
            </Avatar>
          </IconButton>
        </Box>

        {/* Account Menu */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                mt: 1.5,
                minWidth: 200,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            {t('header.profile')}
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            {t('header.settings')}
          </MenuItem>
          <Divider />
          <MenuItem>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            {t('header.logout')}
          </MenuItem>
        </Menu>

        {/* Role Switcher Menu */}
        <Menu
          anchorEl={roleMenuAnchor}
          id="role-menu"
          open={roleMenuOpen}
          onClose={handleRoleMenuClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                mt: 1.5,
                minWidth: 200,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {t('users.switchRole')}
            </Typography>
          </Box>
          <Divider />
          {currentUser?.roles?.map((role) => (
            <MenuItem
              key={role}
              onClick={() => handleSwitchRole(role)}
              disabled={role === currentUser.activeRole || switchingRole}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {role === currentUser.activeRole && (
                  <ListItemIcon sx={{ minWidth: 'auto' }}>
                    <CheckCircleIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                )}
                <Typography>{t(`roles.${role}`)}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
