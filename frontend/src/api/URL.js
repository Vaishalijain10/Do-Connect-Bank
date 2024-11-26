// api/URL.js
// Dynamically set the base URL based on the environment
const isLocalhost = window.location.hostname === "localhost";

export const baseUrl = isLocalhost
  ? "http://localhost:1234" // Local backend
  : process.env.REACT_APP_BASE_URL; // Deployed backend

export const userUrl = `${baseUrl}/user`;
export const accountUrl = `${baseUrl}/account`;
