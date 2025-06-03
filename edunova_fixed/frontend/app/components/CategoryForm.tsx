import React, { useState } from 'react';
import { categoryAPI } from '../lib/category';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const CategoryForm: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage('Category name is required');
      return;
    }

    try {
      const response = await categoryAPI.createCategory({ name });
      setMessage(`Category "${response.data.name}" created successfully!`);
      setName('');
      navigate('/category');
    } catch (error: any) {
      if (error.response) {
        setMessage(error.response.data.message || 'An error occurred');
      } else {
        setMessage('Server error');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Create New Category</h2>
      {message && (
        <div className="mb-2 text-sm text-red-500">{message}</div>
      )}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Category Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="e.g., Web Development"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create
      </button>
    </form>
  );
};

export default CategoryForm;
