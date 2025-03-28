import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: "", first_name: "", last_name: "", email: "", avatar: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://reqres.in/api/users/${id}`);
        if (response.data && response.data.data) {
          setUser({
            id: response.data.data.id,
            first_name: response.data.data.first_name,
            last_name: response.data.data.last_name,
            email: response.data.data.email,
            avatar: response.data.data.avatar,
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://reqres.in/api/users/${id}`, user);
      
      // Store updated user in localStorage to persist between components
      const usersData = JSON.parse(localStorage.getItem('usersData') || '[]');
      const updatedUsers = usersData.map(u => 
        u.id === parseInt(id) ? { ...u, ...user } : u
      );
      localStorage.setItem('usersData', JSON.stringify(updatedUsers));
      
      navigate('/users');
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-user-container">
      <h2>Edit User</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={user.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update User</button>
        <button type="button" onClick={() => navigate('/users')}>Cancel</button>
      </form>
    </div>
  );
};

export default EditUser;