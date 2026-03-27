import { api } from '@/src/services/api';

export async function initiateGoogleAuthFlow() {
  try {
    // This endpoint is provided by better-auth
    const response = await api.post('/auth/sign-in/google');
    
    if (response.data?.url) {
      // Redirect to Google OAuth consent screen
      window.location.href = response.data.url;
    }
  } catch (error) {
    console.error('Failed to initiate Google auth:', error);
    throw error;
  }
}

export async function handleOAuthCallback() {
  // This is typically handled by better-auth automatically
  // but we can use this function for any custom post-auth logic
  try {
    const response = await api.get('/auth/session');
    return response.data;
  } catch (error) {
    console.error('Failed to get session after OAuth:', error);
    throw error;
  }
}
