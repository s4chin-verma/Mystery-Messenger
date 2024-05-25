'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';

export const NavBar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;
  return (
    <header className="py-4 md:py-4 shadow-md fixed top-0 left-0 right-0 bg-white">
      <nav className="md:max-w-screen-xl mx-auto flex items-center justify-between px-6 md:px-0">
        <Link href="/">
          <h1 className="text-base md:text-xl font-bold">Mystery Messenger</h1>
        </Link>
        {/* <Link href={'/dashboard'}>Dashboard</Link>
        <Link href={'/profile'}>Profile</Link> */}
        {session ? (
          <>
            <Button
              onClick={() => {
                signOut();
              }}
              className=""
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
