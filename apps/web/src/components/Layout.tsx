import { Link, Outlet } from "react-router-dom";

const Logo = () => (
  <svg
    className="h-6 w-6 text-primary"
    fill="none"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"
      fill="currentColor"
    ></path>
  </svg>
);

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-gray-200 dark:border-gray-800">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            JudgePass
          </h2>
        </Link>
        {/* You can add your ConnectWallet component here later if needed */}
      </header>

      <main className="flex-grow">
        <Outlet /> {/* Child routes will render here */}
      </main>

      <footer className="text-center py-6 px-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2024 JudgePass. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
