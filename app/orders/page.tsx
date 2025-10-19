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
} from '@mui/material';
import DashboardLayout from '@/components/DashboardLayout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ordersApi, Order, CreateOrderDto, UpdateOrderDto } from '@/lib/api/orders';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<CreateOrderDto>({
    orderNumber: '',
    customerName: '',
    product: '',
    amount: 0,
    status: 'pending',
    description: '',
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (order?: Order) => {
    if (order) {
      setEditingOrder(order);
      setFormData({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        product: order.product,
        amount: order.amount,
        status: order.status,
        description: order.description || '',
      });
    } else {
      setEditingOrder(null);
      setFormData({
        orderNumber: '',
        customerName: '',
        product: '',
        amount: 0,
        status: 'pending',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingOrder(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingOrder) {
        await ordersApi.update(editingOrder._id, formData as UpdateOrderDto);
      } else {
        await ordersApi.create(formData);
      }
      handleCloseDialog();
      loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('คุณต้องการลบคำสั่งซื้อนี้หรือไม่?')) {
      try {
        await ordersApi.delete(id);
        loadOrders();
      } catch (err: any) {
        setError(err.response?.data?.message || 'ไม่สามารถลบคำสั่งซื้อได้');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === 'amount' ? Number(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'รอดำเนินการ',
      processing: 'กำลังดำเนินการ',
      completed: 'เสร็จสิ้น',
      cancelled: 'ยกเลิก',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string): 'default' | 'warning' | 'info' | 'success' | 'error' => {
    const colorMap: Record<string, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
      pending: 'warning',
      processing: 'info',
      completed: 'success',
      cancelled: 'error',
    };
    return colorMap[status] || 'default';
  };

  return (
    <DashboardLayout>
      <Container maxWidth={false}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            จัดการคำสั่งซื้อ
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            เพิ่มคำสั่งซื้อใหม่
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
                <TableCell>หมายเลขคำสั่งซื้อ</TableCell>
                <TableCell>ชื่อลูกค้า</TableCell>
                <TableCell>สินค้า</TableCell>
                <TableCell align="right">จำนวนเงิน</TableCell>
                <TableCell>สถานะ</TableCell>
                <TableCell align="right">จัดการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    กำลังโหลด...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    ไม่มีข้อมูลคำสั่งซื้อ
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell align="right">
                      ฿{order.amount.toLocaleString('th-TH')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(order.status)}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(order)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(order._id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingOrder ? 'แก้ไขคำสั่งซื้อ' : 'เพิ่มคำสั่งซื้อใหม่'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                name="orderNumber"
                label="หมายเลขคำสั่งซื้อ"
                value={formData.orderNumber}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="customerName"
                label="ชื่อลูกค้า"
                value={formData.customerName}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="product"
                label="สินค้า"
                value={formData.product}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="amount"
                label="จำนวนเงิน"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="status"
                label="สถานะ"
                select
                value={formData.status}
                onChange={handleChange}
                fullWidth
                SelectProps={{ native: true }}
              >
                <option value="pending">รอดำเนินการ</option>
                <option value="processing">กำลังดำเนินการ</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="cancelled">ยกเลิก</option>
              </TextField>
              <TextField
                name="description"
                label="คำอธิบาย"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>ยกเลิก</Button>
            <Button onClick={handleSubmit} variant="contained">
              บันทึก
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
}
