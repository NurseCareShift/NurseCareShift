import csurf from 'csurf';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: isProduction, // Use secure cookies in production
    sameSite: isProduction ? 'none' : 'lax', // Use 'none' in production
  },
});
