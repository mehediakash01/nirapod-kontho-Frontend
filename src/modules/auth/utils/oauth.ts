import { api } from '@/src/services/api';

export async function initiateGoogleAuthFlow() {
  try {
    // Get the OAuth URL from backend
    const response = await api.get('/oauth/google');
    
    if (response.data?.url) {
      // Redirect to Google OAuth
      window.location.href = response.data.url;
    } else {
      throw new Error('Failed to get OAuth URL');
    }
  } catch (error) {
    console.error('Failed to initiate Google auth:', error);
    throw error;
  }
}
