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
import { productsApi, Product, CreateProductDto, UpdateProductDto } from '@/lib/api/products';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    status: 'active',
    imageUrl: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลสินค้าได้');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        status: product.status,
        imageUrl: product.imageUrl || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
        status: 'active',
        imageUrl: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingProduct) {
        await productsApi.update(editingProduct._id, formData as UpdateProductDto);
      } else {
        await productsApi.create(formData);
      }
      handleCloseDialog();
      loadProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('คุณต้องการลบสินค้านี้หรือไม่?')) {
      try {
        await productsApi.delete(id);
        loadProducts();
      } catch (err: any) {
        setError(err.response?.data?.message || 'ไม่สามารถลบสินค้าได้');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === 'price' || e.target.name === 'stock' 
      ? Number(e.target.value) 
      : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <DashboardLayout>
      <Container maxWidth={false}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            จัดการสินค้า
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            เพิ่มสินค้าใหม่
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
                <TableCell>ชื่อสินค้า</TableCell>
                <TableCell>หมวดหมู่</TableCell>
                <TableCell align="right">ราคา</TableCell>
                <TableCell align="right">คงเหลือ</TableCell>
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
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    ไม่มีข้อมูลสินค้า
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body1">{product.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell align="right">
                      ฿{product.price.toLocaleString('th-TH')}
                    </TableCell>
                    <TableCell align="right">{product.stock}</TableCell>
                    <TableCell>
                      <Chip
                        label={product.status === 'active' ? 'พร้อมขาย' : 'ไม่พร้อมขาย'}
                        color={product.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(product)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(product._id)}
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
            {editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                name="name"
                label="ชื่อสินค้า"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="description"
                label="คำอธิบาย"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                required
              />
              <TextField
                name="price"
                label="ราคา"
                type="number"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="category"
                label="หมวดหมู่"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="stock"
                label="จำนวนในสต็อก"
                type="number"
                value={formData.stock}
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
                <option value="active">พร้อมขาย</option>
                <option value="inactive">ไม่พร้อมขาย</option>
              </TextField>
              <TextField
                name="imageUrl"
                label="URL รูปภาพ"
                value={formData.imageUrl}
                onChange={handleChange}
                fullWidth
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
