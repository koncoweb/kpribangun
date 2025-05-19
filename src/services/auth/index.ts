
// Export all functionality from the auth service
export { 
  login,
  loginAsAnggota,
  logoutUser,
  getCurrentUser,
  isAuthenticated,
  checkLoginStatus
} from './core';

export {
  updatePassword
} from './password';

export {
  registerUser
} from './registration';

export {
  initDefaultUsers,
  initDefaultRoles
} from './initialization';

export { AUTH_USER_KEY } from './constants';

// Re-export types
export * from './types';
