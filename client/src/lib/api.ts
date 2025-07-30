import axios from 'axios';

const api = axios.create({
  baseURL: 'https://movie-n7v9k327g-anglos-projects.vercel.app/api',
});

export default api;
