"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

interface Props {
  children: React.ReactNode;
  session: any; // You might want to use a more specific type for the session
}

const NextAuthProvider = ({ children, session }: Props) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default NextAuthProvider;
