'use client';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Typography,
  Box,
  Alert,
  Autocomplete,
  Menu,
  MenuItem,
} from '@mui/material';
import DashboardLayout from '@/components/DashboardLayout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { usersApi, User, CreateUserDto, UpdateUserDto } from '@/lib/api/users';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function UsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserDto>({
    name: '',
    email: '',
    phone: '',
    status: 'active',
    roles: ['user'],
    activeRole: 'user',
  });
  const [switchRoleAnchor, setSwitchRoleAnchor] = useState<null | HTMLElement>(null);
  const [selectedUserForRoleSwitch, setSelectedUserForRoleSwitch] = useState<User | null>(null);

  const availableRoles = [
    { value: 'user', label: t('roles.user') },
    { value: 'admin', label: t('roles.admin') },
    { value: 'editor', label: t('roles.editor') },
    { value: 'viewer', label: t('roles.viewer') },
    { value: 'manager', label: t('roles.manager') },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || t('users.errorLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        status: user.status,
        roles: user.roles || (user.role ? [user.role] : ['user']),
        activeRole: user.activeRole || user.role || 'user',
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'active',
        roles: ['user'],
        activeRole: 'user',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await usersApi.update(editingUser._id, formData as UpdateUserDto);
      } else {
        await usersApi.create(formData);
      }
      handleCloseDialog();
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || t('users.errorSave'));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('users.deleteConfirm'))) {
      try {
        await usersApi.delete(id);
        loadUsers();
      } catch (err: any) {
        setError(err.response?.data?.message || t('users.errorDelete'));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenRoleSwitch = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setSwitchRoleAnchor(event.currentTarget);
    setSelectedUserForRoleSwitch(user);
  };

  const handleCloseRoleSwitch = () => {
    setSwitchRoleAnchor(null);
    setSelectedUserForRoleSwitch(null);
  };

  const handleSwitchRole = async (newRole: string) => {
    if (!selectedUserForRoleSwitch) return;
    
    try {
      await usersApi.switchRole(selectedUserForRoleSwitch._id, { activeRole: newRole });
      handleCloseRoleSwitch();
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || t('users.errorSwitchRole'));
      handleCloseRoleSwitch();
    }
  };

  const getRoleLabel = (roleValue: string) => {
    const role = availableRoles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  return (
    <DashboardLayout>
      <Container maxWidth={false}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            {t('users.title')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            {t('users.addNew')}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('common.name')}</TableCell>
                <TableCell>{t('common.email')}</TableCell>
                <TableCell>{t('common.phone')}</TableCell>
                <TableCell>{t('common.status')}</TableCell>
                <TableCell>{t('users.allRoles')}</TableCell>
                <TableCell>{t('users.currentRole')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {t('common.loading')}
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const userRoles = user.roles || (user.role ? [user.role] : ['user']);
                  const userActiveRole = user.activeRole || user.role || 'user';
                  
                  return (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.status === 'active' ? t('common.active') : t('common.inactive')}
                          color={user.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {userRoles.map((role) => (
                            <Chip
                              key={role}
                              label={getRoleLabel(role)}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={getRoleLabel(userActiveRole)}
                            color="primary"
                            size="small"
                          />
                          {userRoles.length > 1 && (
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => handleOpenRoleSwitch(e, user)}
                              title={t('users.switchRole')}
                            >
                              <SwapHorizIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(user)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(user._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Role Switch Menu */}
        <Menu
          anchorEl={switchRoleAnchor}
          open={Boolean(switchRoleAnchor)}
          onClose={handleCloseRoleSwitch}
        >
          {selectedUserForRoleSwitch?.roles?.map((role) => (
            <MenuItem
              key={role}
              onClick={() => handleSwitchRole(role)}
              selected={role === selectedUserForRoleSwitch.activeRole}
            >
              {getRoleLabel(role)}
            </MenuItem>
          ))}
        </Menu>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingUser ? t('users.editUser') : t('users.addNew')}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                name="name"
                label={t('common.name')}
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="email"
                label={t('common.email')}
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="phone"
                label={t('common.phone')}
                value={formData.phone}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="status"
                label={t('common.status')}
                select
                value={formData.status}
                onChange={handleChange}
                fullWidth
                SelectProps={{ native: true }}
              >
                <option value="active">{t('common.active')}</option>
                <option value="inactive">{t('common.inactive')}</option>
              </TextField>
              <Autocomplete
                multiple
                options={availableRoles}
                getOptionLabel={(option) => option.label}
                value={availableRoles.filter(r => formData.roles?.includes(r.value))}
                onChange={(_, newValue) => {
                  const newRoles = newValue.map(v => v.value);
                  setFormData({
                    ...formData,
                    roles: newRoles,
                    activeRole: newRoles.includes(formData.activeRole || '') 
                      ? formData.activeRole 
                      : newRoles[0] || 'user',
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('users.allRoles')}
                    placeholder={t('users.selectRoles')}
                  />
                )}
              />
              <TextField
                name="activeRole"
                label={t('users.currentRole')}
                select
                value={formData.activeRole}
                onChange={handleChange}
                fullWidth
                SelectProps={{ native: true }}
              >
                {formData.roles?.map((role) => (
                  <option key={role} value={role}>
                    {getRoleLabel(role)}
                  </option>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
            <Button onClick={handleSubmit} variant="contained">
              {t('common.save')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
}
