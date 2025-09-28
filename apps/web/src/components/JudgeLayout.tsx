import { Link, Outlet, useLocation } from "react-router-dom";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { ConnectWallet } from "./ConnectWallet";
import { useAccount } from "wagmi";

const Logo = () => (
  <svg
    className="h-6 w-6 text-primary shrink-0"
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

const NavLink = ({
  to,
  icon,
  children,
}: {
  to: string;
  icon: string;
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive
          ? "bg-primary text-white"
          : "hover:bg-primary/10 dark:hover:bg-primary/20 text-gray-700 dark:text-gray-300"
      }`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span>{children}</span>
    </Link>
  );
};

export function JudgeLayout() {
  const { isConnected } = useAccount();

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      <aside className="w-64 flex-shrink-0 p-6 border-r border-gray-200 dark:border-gray-800 flex-col justify-between hidden md:flex">
        <div>
          <Link to="/" className="flex items-center gap-3 mb-8">
            <Logo />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              JudgePass
            </h1>
          </Link>
          <nav className="flex flex-col space-y-2">
            <NavLink to="/judge" icon="dashboard">
              Dashboard
            </NavLink>
            <NavLink to="/judge/submissions" icon="folder_open">
              Submissions
            </NavLink>
            <NavLink to="/judge/marketplace" icon="storefront">
              Marketplace
            </NavLink>
            <NavLink to="#" icon="groups">
              Judges
            </NavLink>
          </nav>
        </div>
        {/* Replace the old profile section with the new button */}
        <div className="mt-auto">
          <ConnectWalletButton />
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex md:hidden items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {/* ... Mobile Header ... */}
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {/* Prompt to connect if not connected */}
          {!isConnected && (
            <div className="text-center p-10 bg-white/5 dark:bg-black/5 rounded-lg flex flex-col items-center gap-4 max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-2">Welcome!</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Please connect your wallet to access the dashboard.
              </p>
              <div className="w-full max-w-xs">
                <ConnectWalletButton />
              </div>
            </div>
          )}
          {isConnected && <Outlet />}
        </main>
      </div>
    </div>
  );
}
