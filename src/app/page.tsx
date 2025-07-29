export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-100 via-gray-100 to-lime-100 p-4 sm:p-6 md:p-8">
      <div className="text-center space-y-6 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-700 drop-shadow-lg">
          Welcome to Student Management System
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-md md:max-w-lg lg:max-w-2xl">
          Manage students, courses, and reports with ease and efficiency.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 text-sm sm:text-base font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            Go to Dashboard
          </a>
          <a
            href="/students"
            className="inline-block px-6 py-3 text-sm sm:text-base font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors duration-200"
          >
            View Students
          </a>
        </div>
      </div>
    </main>
  );
}
