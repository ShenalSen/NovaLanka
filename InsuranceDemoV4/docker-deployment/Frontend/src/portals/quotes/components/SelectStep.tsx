import React from 'react';
import type { Product } from '../../../hooks/useInstantQuote';
import * as S from '../../../styles/quotes/InstantQuote.styled';

interface SelectStepProps {
  products: Product[];
  loadingProducts: boolean;
  productError: string | null;
  selectedId: string | undefined;
  onSelect: (product: Product) => void;
  formatCurrency: (amount: number) => string;
}

const SelectStep: React.FC<SelectStepProps> = ({
  products, loadingProducts, productError, selectedId, onSelect, formatCurrency,
}) => (
  <>
    <S.StepHeading>Choose a Plan</S.StepHeading>
    <S.StepSubheading>
      Select the insurance product you'd like to get a quote for.
    </S.StepSubheading>

    {loadingProducts ? (
      <p style={{ color: '#718096' }}>Loading products…</p>
    ) : productError ? (
      <S.ErrorBanner>{productError}</S.ErrorBanner>
    ) : (
      <S.ProductGrid>
        {products.map(product => (
          <S.ProductCard
            key={product.product_id}
            selected={selectedId === product.product_id}
            onClick={() => onSelect(product)}
          >
            <S.ProductCardBadge>{product.coverage_type}</S.ProductCardBadge>
            <S.ProductCardName>{product.name}</S.ProductCardName>
            <S.ProductCardDesc>{product.description}</S.ProductCardDesc>
            <S.ProductCardCoverage>
              Coverage up to {formatCurrency(product.coverage_amount)}
            </S.ProductCardCoverage>
          </S.ProductCard>
        ))}
      </S.ProductGrid>
    )}
  </>
);

export default SelectStep;
