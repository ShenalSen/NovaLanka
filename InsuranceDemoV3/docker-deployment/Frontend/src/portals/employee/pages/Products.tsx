import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../../../lib/api/productsApi';
import {
  PageContainer,
  TableContainer,
  Table,
  TableHeader,
  TableRow,
  TableCell
} from '../../../styles/employee/Products.styled';

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

  if (loading) return <PageContainer>Loading...</PageContainer>;
  if (error) return <PageContainer>{error}</PageContainer>;

  return (
    <PageContainer>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader>Product_ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Detail</TableHeader>
              <TableHeader>Coverage Type</TableHeader>
              <TableHeader>Coverage Amount</TableHeader>
              <TableHeader>Premium</TableHeader>
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
                <TableCell>{product.premium}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

export default Products;