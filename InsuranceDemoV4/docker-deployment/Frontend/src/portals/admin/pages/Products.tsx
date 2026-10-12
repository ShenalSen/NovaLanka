import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, deleteProductById } from '../../../lib/api/productsApi';
import {
  PageContainer,
  PageHeader,
  ButtonGroup,
  Button,
  TableContainer,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  DeleteButton
} from '../../../styles/admin/Products.styled';

interface Product {
  product_id: string;
  name: string;
  description: string;
  coverage_type: string;
  coverage_amount: number;
  deductible: number;
  premium: string;
}

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [deleteMode, setDeleteMode] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllProducts()
      .then(res => {
        setProducts(res.data.Products?.Product || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch products');
        setLoading(false);
      });
  }, []);

  const handleAddProduct = () => navigate('/admin/products/create');
  const handleDeleteModeToggle = () => setDeleteMode(!deleteMode);

  const handleDeleteProduct = async (product_id: string) => {
    try {
      await deleteProductById(product_id);
      setProducts(prev => prev.filter(p => p.product_id !== product_id));
    } catch {
      setError('Failed to delete product');
    }
  };

  if (loading) return <PageContainer>Loading...</PageContainer>;
  if (error) return <PageContainer>{error}</PageContainer>;

  return (
    <PageContainer>
      <PageHeader>
        <br />
        <ButtonGroup>
          <Button onClick={handleAddProduct}>Add</Button>
          <Button variant="danger" onClick={handleDeleteModeToggle}>
            {deleteMode ? 'Cancel' : 'Delete'}
          </Button>
        </ButtonGroup>
      </PageHeader>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Product_ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Detail</TableHeader>
              <TableHeader>Coverage Type</TableHeader>
              <TableHeader>Coverage Amount</TableHeader>
              <TableHeader>Deductible</TableHeader>
              <TableHeader>Premium</TableHeader>
              {deleteMode && <TableHeader></TableHeader>}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <TableRow key={product.product_id}>
                <TableCell>{product.product_id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.coverage_type}</TableCell>
                <TableCell>{product.coverage_amount}</TableCell>
                <TableCell>{product.deductible}</TableCell>
                <TableCell>{product.premium}</TableCell>
                {deleteMode && (
                  <TableCell>
                    <DeleteButton onClick={() => handleDeleteProduct(product.product_id)}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4H3.33333H14" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.33334 4V2.66667C5.33334 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33334 6.66668 1.33334H9.33334C9.68697 1.33334 10.0261 1.47381 10.2762 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2762 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66668C4.31305 14.6667 3.97392 14.5262 3.72387 14.2761C3.47382 14.0261 3.33334 13.687 3.33334 13.3333V4H12.6667Z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </DeleteButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

export default Products;