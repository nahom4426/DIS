import ApiService from "@/service/ApiService";

// Use correct environment variable
const api = new ApiService(import.meta.env.v_API_URI);
const path = "/auth/users";

export function signup(data, config = {}) {
  return api.post(`${path}/signUp`, data, config);
}

export function login(data, config = {}) {
  return api.post(`${path}/signIn`, data, config);
}

// Send password reset code to email (email in URL, no body)
export function sendResetCode(email, config = {}) {
  return api.put(`${path}/password/sendResetCode/${email}`, {}, config);
}

// Old forgot password (if still needed)
export function forgotPassword(data, config = {}) {
  return api.post(`${path}/forgotPassword`, data, config);
}

// Reset password using code and new password
export function resetPassword(data, config = {}) {
  return api.put(`${path}/password/resetPassword`, data, config);
}

// Check password reset code (verificationCode and email as query params, POST request)
export function checkResetCode({ verificationCode, email }, config = {}) {
  return api.post(
    `${path}/password/checkResetCode?verificationCode=${verificationCode}&email=${encodeURIComponent(email)}`,
    {},
    config
  );
}
