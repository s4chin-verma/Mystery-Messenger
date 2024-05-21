'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';

export const NavBar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;
  return (
    <header className="py-4 md:py-6 shadow-md">
      <nav className="md:max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold mb-4 md:mb-0">True Feedback</h1>
        </Link>
        {session ? (
          <>
            <span className="mr-4">Welcome, {user.username || user.email}</span>
            <Button
              onClick={() => {
                signOut();
              }}
              className="w-full md:w-auto"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button>Login</Button>
          </Link>
        )}
      </nav>
    </header>
  );
};
