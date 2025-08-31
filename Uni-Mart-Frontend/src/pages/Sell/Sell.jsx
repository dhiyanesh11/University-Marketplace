import React, { useState } from 'react';
import './Sell.css'; // Assuming Sell.css contains your styles

const Sell = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    description: '',
    category: 'books', // Default category
    photo: null, // Stores the File object for the photo
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file selected
    setFormData(prev => ({
      ...prev,
      photo: file,
    }));
  };

  const handleSubmit = async (e) => { // Make handleSubmit async
    e.preventDefault();

    // 1. Create FormData object
    const dataToSend = new FormData();
    dataToSend.append('item_name', formData.itemName); // Match Django field names (snake_case common)
    dataToSend.append('price', formData.price);
    dataToSend.append('description', formData.description);
    dataToSend.append('category', formData.category);
    if (formData.photo) {
      dataToSend.append('photo', formData.photo); // The actual file
    }

    // 2. Send data to Django backend
    try {
      const response = await fetch('http://localhost:8000/api/items/', { // <--- IMPORTANT: Your Django backend URL
        method: 'POST',
        // When sending FormData, the 'Content-Type' header is usually set automatically
        // You might need to add headers for authentication later (e.g., 'Authorization': 'Token YOUR_TOKEN')
      });

      if (!response.ok) {
        // Handle HTTP errors (e.g., 400 Bad Request, 500 Internal Server Error)
        const errorData = await response.json(); // Try to parse error response
        console.error('Error submitting form:', errorData);
        alert(`Failed to post item: ${JSON.stringify(errorData)}`);
        return; // Stop execution if there's an error
      }

      const responseData = await response.json(); // Parse the successful response
      console.log('Item Posted Successfully:', responseData);
      alert('Item Posted Successfully!');

      // 3. Reset form on successful submission
      setFormData({
        itemName: '',
        price: '',
        description: '',
        category: 'books',
        photo: null,
      });

      // Clear the file input visually (optional)
      const fileInput = document.querySelector('input[type="file"][name="photo"]');
      if (fileInput) {
        fileInput.value = ''; // Reset the input field
      }

    } catch (error) {
      console.error('Network error or unexpected error:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="sell-page-container">
      <div className="sell-card">
        <h2>Sell an Item</h2>
        {/* encType="multipart/form-data" is crucial for file uploads */}
        <form className="sell-form" onSubmit={handleSubmit} encType="multipart/form-data">
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
            <option value="" disabled>
               Select item type
            </option>
            <option value="books">Books/Study material</option>

            <option value="electronics">Electronics</option>
            <option value="home_appliance">Home Appliance</option>
            <option value="vehicle">Vehicle</option>
          </select>

          <label htmlFor="price">
            Price:
            <input
              type="number" // Use type="number" for prices
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

          <button type="submit">Post Item</button>
        </form>
      </div>
    </div>
  );
};

export default Sell;