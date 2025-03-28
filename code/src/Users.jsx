import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    
    fetchUsers();
  }, [navigate, page]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      const apiUsers = response.data.data;
      setTotalPages(response.data.total_pages);
      
      // Get any locally updated users
      const localUsers = JSON.parse(localStorage.getItem('usersData') || '[]');
      
      // Merge API data with any local updates
      const mergedUsers = apiUsers.map(apiUser => {
        const localUser = localUsers.find(u => u.id === apiUser.id);
        return localUser || apiUser;
      });
      
      setUsers(mergedUsers);
      
      // Store initial data in localStorage if not already there
      if (!localStorage.getItem('usersData')) {
        localStorage.setItem('usersData', JSON.stringify(apiUsers));
      }
    } catch (error) {
      console.error("Error Fetching Users:", error);
      setError("Failed to fetch users");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      
      // Update local storage
      const localUsers = JSON.parse(localStorage.getItem('usersData') || '[]');
      const updatedUsers = localUsers.filter(user => user.id !== id);
      localStorage.setItem('usersData', JSON.stringify(updatedUsers));
      
      // Update state
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleEdit = (id) => {
    navigate(`/edit-user/${id}`);
  };

  return (
    <div className="users-container">
      <h2>User List</h2>
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleLogout}>Logout</button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <img src={user.avatar} alt={`${user.first_name}`} style={{ width: "50px", borderRadius: "50%" }} />
            <span>{user.first_name} {user.last_name} - {user.email}</span>
            <button onClick={() => handleEdit(user.id)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="pagination-controls">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;