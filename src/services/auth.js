import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Replace with your actual API base URL

export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
  const { access_token: token, user } = response.data;
  localStorage.setItem('token', token); // Save token for persistent login
  return { token, user };
};

export const logoutUser = () => {
  localStorage.removeItem('token'); // Remove token
  window.location.reload(); // Reload to clear any persisted state
};
