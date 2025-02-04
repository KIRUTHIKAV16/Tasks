import React from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';

const products = [
  { id: 1, name: 'Samsung Phone', price: 25000 },
  { id: 2, name: 'Women Printed Kurthi', price: 1500 },
  { id: 3, name: 'Men Shirt', price: 1250 },
  { id: 4, name: 'cupboard', price: 15000 },
  { id: 5, name: 'Sports shoes', price: 1350 },
  
];

const ProductList = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <h3>Products</h3>
      {products.map((product) => (
        <div key={product.id}>
          <h4>{product.name}</h4>
          <p>Price: ${product.price}</p>
          <button onClick={() => dispatch(addItem(product))}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
