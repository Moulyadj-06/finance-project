// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api"
// });

// // attach token
// API.interceptors.request.use((req) => {
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (user?.token) {
//     req.headers.Authorization = `Bearer ${user.token}`;
//   }

//   return req;
// });

// export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // 🔥 your backend URL
});

// Add token automatically to requests if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;