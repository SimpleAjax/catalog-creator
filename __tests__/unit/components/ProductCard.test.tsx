// ProductCard component tests
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {ProductCard} from '@/components/ProductCard';
import {Product} from '@/types';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 499,
  mrp: 599,
  description: 'A test product',
  imageUri: 'test-image.jpg',
  tags: ['tag1', 'tag2'],
  category: 'Electronics',
  source: 'Gallery',
  stockStatus: 'in-stock',
  dateAdded: '2024-03-15T10:00:00Z',
  archived: false,
};

describe('ProductCard', () => {
  it('renders product name correctly', () => {
    const {getByText} = render(<ProductCard product={mockProduct} />);
    expect(getByText('Test Product')).toBeTruthy();
  });

  it('renders formatted price when price exists', () => {
    const {getByText} = render(<ProductCard product={mockProduct} />);
    expect(getByText('₹499')).toBeTruthy();
  });

  it('does not render price overlay when price is null', () => {
    const productWithoutPrice = {...mockProduct, price: null};
    const {queryByText} = render(<ProductCard product={productWithoutPrice} />);
    expect(queryByText(/₹/)).toBeNull();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const {getByTestId} = render(
      <ProductCard product={mockProduct} onPress={onPress} testID="product-card" />,
    );

    fireEvent.press(getByTestId('product-card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('calls onLongPress when long pressed', () => {
    const onLongPress = jest.fn();
    const {getByTestId} = render(
      <ProductCard
        product={mockProduct}
        onLongPress={onLongPress}
        testID="product-card"
      />,
    );

    fireEvent(getByTestId('product-card'), 'onLongPress');
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('shows checkmark when selected', () => {
    const {getByTestId} = render(
      <ProductCard product={mockProduct} selected={true} testID="product-card" />,
    );
    expect(getByTestId('checkmark')).toBeTruthy();
  });

  it('does not show checkmark when not selected', () => {
    const {queryByTestId} = render(
      <ProductCard product={mockProduct} selected={false} testID="product-card" />,
    );
    expect(queryByTestId('checkmark')).toBeNull();
  });

  it('applies selected style when selected', () => {
    const {getByTestId} = render(
      <ProductCard product={mockProduct} selected={true} testID="product-card" />,
    );
    const card = getByTestId('product-card');
    const style = card.props.style;
    // Check if any style object has borderWidth property (indicating selected state)
    const hasSelectedStyle = style.some(
      (s: any) => s && s.borderWidth === 2,
    );
    expect(hasSelectedStyle).toBe(true);
  });

  it('truncates long product names', () => {
    const longNameProduct = {
      ...mockProduct,
      name: 'This is a very long product name that should be truncated',
    };
    const {getByText} = render(<ProductCard product={longNameProduct} />);
    const nameText = getByText(longNameProduct.name);
    expect(nameText.props.numberOfLines).toBe(1);
  });

  it('renders with custom style', () => {
    const customStyle = {margin: 10};
    const {getByTestId} = render(
      <ProductCard product={mockProduct} style={customStyle} testID="product-card" />,
    );
    const card = getByTestId('product-card');
    expect(card).toBeTruthy();
  });

  it('has accessibility label', () => {
    const {getByLabelText} = render(<ProductCard product={mockProduct} />);
    expect(getByLabelText('Test Product')).toBeTruthy();
  });

  it('renders product with zero price correctly', () => {
    const freeProduct = {...mockProduct, price: 0};
    const {getByText} = render(<ProductCard product={freeProduct} />);
    expect(getByText('₹0')).toBeTruthy();
  });

  it('handles very long prices', () => {
    const expensiveProduct = {...mockProduct, price: 999999};
    const {getByText} = render(<ProductCard product={expensiveProduct} />);
    expect(getByText('₹999999')).toBeTruthy();
  });
});
