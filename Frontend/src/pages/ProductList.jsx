import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8888/products', {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Products fetched:', response.data.products); // Debugging line
        setProducts(response.data.products);
    })
    .catch(error => {
        console.error('There was an error fetching the products!', error);
    });
}, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded-lg shadow">
            <img src={`src/assets/${product.image}`} alt={product.name} className="w-full h-60 object-cover mb-4" />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-700 mb-2">{product.description}</p>
            <p className="text-green-500 font-bold">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
