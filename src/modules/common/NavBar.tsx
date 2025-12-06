'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function NavBar() {
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              Signal Works LMS
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/courses" className="hover:text-indigo-200 transition">
                Courses
              </Link>
              <Link href="/assessment" className="hover:text-indigo-200 transition">
                Assessment
              </Link>
              <Link href="/student" className="hover:text-indigo-200 transition">
                Student
              </Link>
              <Link href="/instructor" className="hover:text-indigo-200 transition">
                Instructor
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 transition"
              >
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}
