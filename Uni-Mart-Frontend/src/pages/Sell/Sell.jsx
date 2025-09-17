import React, { useState } from 'react';

export default function Sell() {
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    description: '',
    category: 'books', // Default category
    photo: null, // Stores the File object for the photo
  });
  const [isPosting, setIsPosting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      photo: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setIsPosting(true);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setStatusMessage('Please log in to post an item.');
      setIsPosting(false);
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append('item_name', formData.itemName);
    dataToSend.append('price', formData.price);
    dataToSend.append('description', formData.description);
    dataToSend.append('item_category', formData.category);
    if (formData.photo) {
      dataToSend.append('image', formData.photo);
    }

    try {
      const response = await fetch('http://localhost:8000/api/selling_posts/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: dataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error submitting form:', errorData);
        setStatusMessage(`Failed to post item: ${JSON.stringify(errorData)}`);
      } else {
        const responseData = await response.json();
        console.log('Item Posted Successfully:', responseData);
        setStatusMessage('Item Posted Successfully!');

        setFormData({
          itemName: '',
          price: '',
          description: '',
          category: 'books',
          photo: null,
        });

        const fileInput = document.querySelector('input[type="file"][name="photo"]');
        if (fileInput) {
          fileInput.value = '';
        }
      }
    } catch (error) {
      console.error('Network error or unexpected error:', error);
      setStatusMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <>
      <style>
        {`
        .sell-page-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 5rem;
            background-color: #f0f2f5;
            min-height: 100vh;
        }

        .sell-card {
            background-color: #fff;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
            width: 100%;
            max-width: 500px;
        }

        .sell-card h2 {
            text-align: center;
            margin-bottom: 1.5rem;
            color: #333;
        }

        .sell-form {
            display: flex;
            flex-direction: column;
            width: 100%;
            margin: 0 auto;
        }

        .sell-form label {
            margin-bottom: 1rem;
            color: #444;
            font-weight: 500;
        }

        .sell-form input,
        .sell-form textarea,
        .sell-form select {
            padding: 0.7rem;
            border: 1px solid #ccc;
            border-radius: 8px;
            margin-top: 0.4rem;
            font-size: 1rem;
            width: 100%;
            background-color: #fff;
            color: #333;
            box-sizing: border-box;
        }

        .sell-form textarea {
            resize: vertical;
            min-height: 80px;
        }

        .sell-form button {
            margin-top: 1rem;
            padding: 0.8rem;
            background-color: #4a90e2;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
        }

        .sell-form button:hover {
            background-color: #3578d6;
        }

        .sell-form select {
            padding: 0.7rem;
            border: 1px solid #ccc;
            border-radius: 8px;
            margin-top: 0.4rem;
            font-size: 1rem;
            width: 100%;
            background-color: #fff;
            color: #333;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-image: url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
            background-repeat: no-repeat;
            background-position: right 0.7rem center;
            background-size: 1.2rem;
            cursor: pointer;
        }
        `}
      </style>
      <div className="sell-page-container">
        <div className="sell-card">
          <h2>Sell an Item</h2>
          <form className="sell-form" onSubmit={handleSubmit}>
            <label htmlFor="itemName">
              Item Name:
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                required
              />
            </label>
            <label htmlFor="category">Item Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select item type</option>
              <option value="books">Books/Study material</option>
              <option value="electronics">Electronics</option>
              <option value="home_appliance">Home Appliance</option>
              <option value="vehicle">Vehicle</option>
            </select>
            <label htmlFor="price">
              Price:
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </label>
            <label htmlFor="description">
              Description:
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </label>
            <label htmlFor="photoUpload">
              Upload Item Photo:
              <input
                type="file"
                id="photoUpload"
                name="photo"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </label>
            <button type="submit" disabled={isPosting}>
              {isPosting ? 'Posting...' : 'Post Item'}
            </button>
            {statusMessage && <p className="status-message">{statusMessage}</p>}
          </form>
        </div>
      </div>
    </>
  );
}