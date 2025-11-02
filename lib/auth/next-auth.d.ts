import NextAuth, { DefaultSession } from 'next-auth';

export {};

declare module 'next-auth' {
  interface Session {
    user?: DefaultSession['user'] & {
      id: string;
      role: 'user' | 'admin';
    };
  }

  interface User {
    role?: 'user' | 'admin';
  }
}
