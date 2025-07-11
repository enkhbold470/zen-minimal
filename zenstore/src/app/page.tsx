export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4">
            ZenStore
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            The Fastest E-commerce Experience
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-green-600">⚡</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Lightning Fast</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-blue-600">🛡️</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Secure</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-purple-600">📱</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Responsive</div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Welcome to ZenStore
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Experience the future of online shopping with our ultra-fast, 
              minimalist e-commerce platform built with Next.js 15 and optimized 
              for performance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Performance
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Built with Next.js 15, Turbopack, and optimized for speed
                </p>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Security
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enterprise-grade security with modern best practices
                </p>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Scalability
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Designed to handle millions of users with ease
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">Ready to Launch?</h2>
            <p className="text-xl mb-8 opacity-90">
              Deploy your store to production with zero configuration
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started
            </button>
          </section>
        </main>

        <footer className="text-center mt-16 text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 ZenStore. Built with Next.js for zenstore.enk.icu</p>
        </footer>
      </div>
    </div>
  );
}
