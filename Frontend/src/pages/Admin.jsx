import React, { useState } from 'react';
import axios from 'axios';
import add_product from "../assets/add_product.png";
import delete_product from "../assets/delete_product.png"

const Admin = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [product, setProduct] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    image: null
  });

  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteId, setDeleteId] = useState(''); // Add this line

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const resetProductForm = () => {
    setProduct({
      id: '',
      name: '',
      description: '',
      price: '',
      image: null
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id', product.id);
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('image', product.image);

    axios.post('http://localhost:8888/products/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log('Product added successfully:', response.data);
      alert('Product added successfully!');
      setShowAddForm(false);
    })
    .catch(error => {
        if (error.response && error.response.status === 400) {
            alert('Product already exists!');
          } else {
            console.error('There was an error adding the product!', error);
          }    });
  };

  const handleDeleteSubmit = (e) => {
    e.preventDefault();
    axios.delete(`http://localhost:8888/products/delete`, {
      data: { id: deleteId },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Product deleted successfully:', response.data);
      alert('Product deleted successfully!');
      setShowDeleteForm(false);
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        alert('Product does not exist!');
      } else {
        console.error('There was an error deleting the product!', error);
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold my-10 mx-5">Admin Page</h1>
      <div className="text-center flex justify-center gap-8">

        <button onClick={() => setShowAddForm(true)} className="relative w-52 h-52">
          <img src={add_product} alt="Add Product" className="w-full h-full object-cover"/>
          <p className="absolute w-44 my-5 left-5 right-0 bg-gray-800 rounded-lg text-white py-2">Add Product</p>
        </button>

        <button onClick={() => setShowDeleteForm(true)} className="relative w-52 h-52">
          <img src={delete_product} alt="Delete Product" className="w-full h-full object-cover "/>
          <p className="absolute w-44 my-5 left-5 right-0 bg-gray-800 rounded-lg text-white py-2">Delete Product</p>
        </button>

      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Product ID</label>
                <input
                  type="text"
                  name="id"
                  value={product.id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Price</label>
                <input
                  type="text"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex justify-between">
              <button type="button" onClick={() => { resetProductForm(); setShowAddForm(false); }} className="px-4 py-2 bg-gray-500 text-white rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        {showDeleteForm && ( // Add this section
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
                    <h2 className="text-xl font-bold mb-4">Delete Product</h2>
                    <form onSubmit={handleDeleteSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Product ID</label>
                        <input
                        type="text"
                        name="id"
                        value={deleteId}
                        onChange={(e) => setDeleteId(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-between">
                    <button type="button" onClick={() => { setDeleteId(''); setShowDeleteForm(false); }} className="px-4 py-2 bg-gray-500 text-white rounded">
                  Cancel
                </button>
                        <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded">
                        Delete
                        </button>
                    </div>
                    </form>
                </div>
                </div>
            )}

    </div>
  );
};

export default Admin;
