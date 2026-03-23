import { auth } from '@/lib/auth/server';

export default auth.middleware({
  loginUrl: '/login',
});

export const config = {
  matcher: [
    // Protect the main app - user must be logged in
    '/',
    '/api/generate',
    '/api/history',
  ],
};
