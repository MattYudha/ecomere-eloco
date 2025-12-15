import type { Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import bcrypt from 'bcryptjs';
import prisma from '@/utils/db';
import jwt from 'jsonwebtoken';

/**
 * NextAuth config (NextAuth v5 compatible)
 * ❌ NO AuthOptions
 * ❌ NO NextAuthOptions
 */
export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordCorrect) {
          throw new Error('Invalid credentials');
        }

        return user;
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        const u = user as any;

        token.id = u.id;
        token.role = u.role;

        token.accessToken = jwt.sign(
          {
            id: u.id,
            role: u.role,
          },
          process.env.JWT_SECRET!,
          { expiresIn: '1d' },
        );
      }

      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }

      if ((token as any).accessToken) {
        (session as any).accessToken = (token as any).accessToken;
      }

      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 15 * 60,
  },

  jwt: {
    maxAge: 15 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
};
