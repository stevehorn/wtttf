import NextAuth, { type NextAuthOptions } from 'next-auth';
import GitubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../server/db/client';
import { env } from '../../../env/server';

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.isActive = user.isActive as string;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GitubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      accessTokenUrl: 'https://accounts.google.com/o/oauth2/token',
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
