import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to Signal Works LMS
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Learn to code with AI-powered adaptive assessment and personalized tutoring
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/courses"
              className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Browse Courses
            </Link>
            <Link
              href="/assessment"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              Try Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Signal Works LMS?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Comprehensive Courses
              </h3>
              <p className="text-gray-600">
                Learn from structured courses covering programming fundamentals to advanced topics
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Tutoring
              </h3>
              <p className="text-gray-600">
                Get personalized help from our AI tutor with context-aware hints and explanations
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Adaptive Learning
              </h3>
              <p className="text-gray-600">
                Practice with challenges tailored to your skill level and learning progress
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Join thousands of students improving their coding skills with adaptive, AI-powered learning
          </p>
          <Link
            href="/courses"
            className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}
