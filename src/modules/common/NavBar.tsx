'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function NavBar() {
  const { user } = useUser();
  const { language, setLanguage, t } = useLanguage();
  const role = (user?.publicMetadata?.role as string) || 'STUDENT';
  const isAdmin = role === 'ADMIN';
  const isStudent = role === 'STUDENT';
  const isInstructor = role === 'INSTRUCTOR';

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              Signal Works LMS
            </Link>
            <div className="hidden md:flex space-x-4">
              {isAdmin ? (
                <Link href="/admin" className="hover:text-indigo-200 transition">
                  {t('nav.dashboard')}
                </Link>
              ) : isStudent ? (
                <Link href="/student" className="hover:text-indigo-200 transition">
                  {t('nav.dashboard')}
                </Link>
              ) : isInstructor ? (
                <Link href="/instructor" className="hover:text-indigo-200 transition">
                  {t('nav.dashboard')}
                </Link>
              ) : (
                <>
                  <Link href="/courses" className="hover:text-indigo-200 transition">
                    {t('nav.courses')}
                  </Link>
                  <Link href="/assessment" className="hover:text-indigo-200 transition">
                    {t('nav.assessment')}
                  </Link>
                  <Link href="/student" className="hover:text-indigo-200 transition">
                    {t('nav.student')}
                  </Link>
                  <Link href="/instructor" className="hover:text-indigo-200 transition">
                    {t('nav.instructor')}
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-2 rounded-md bg-indigo-700 hover:bg-indigo-800 transition"
              aria-label="Toggle language"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="font-medium">{language === 'en' ? 'EN' : '日本語'}</span>
            </button>

            <SignedOut>
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 transition"
              >
                {t('nav.signIn')}
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
