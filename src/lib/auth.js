import { isDemoMode } from './dbConnection';

export const getJwtSecret = () => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (isDemoMode()) {
    return 'demo-secret';
  }

  return null;
};
