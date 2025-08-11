// import ApiService from "@/service/ApiService";

// export async function testBackendConnection() {
//   try {
//     const api = new ApiService();
//     console.log('Testing connection to:', import.meta.env.VITE_API_URI);
    
//     // Test with a simple endpoint (adjust according to your API)
//     const response = await api.get('/health'); // or any available endpoint
//     console.log('Backend connection successful:', response);
//     return true;
//   } catch (error) {
//     console.error('Backend connection failed:', error);
//     console.error('Error details:', {
//       message: error.message,
//       status: error.response?.status,
//       data: error.response?.data,
//       url: error.config?.url
//     });
//     return false;
//   }
// }