import { Link, Outlet, useLocation } from "react-router-dom";
import { ConnectWalletButton } from "./ConnectWalletButton";

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
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        isActive
          ? "bg-primary text-white"
          : "text-neutral-700 dark:text-neutral-300 hover:bg-primary/10 hover:text-neutral-900 dark:hover:text-white"
      }`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  );
};

export function HackerLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 flex-shrink-0 bg-background-light/50 dark:bg-background-dark/50 p-6 hidden md:block">
        <div className="flex flex-col h-full">
          <Link to="/">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              ProofJudge
            </h1>
          </Link>
          <nav className="mt-10 flex flex-col gap-2">
            <NavLink to="/hacker" icon="dashboard">
              Dashboard
            </NavLink>
            <NavLink to="/hacker/submit" icon="add_circle">
              Submit Project
            </NavLink>
            <NavLink to="/hacker/submissions" icon="list_alt">
              My Submissions
            </NavLink>
            <NavLink to="/hacker/disputes" icon="flag">
              Disputes
            </NavLink>
            <NavLink to="#" icon="person">
              My Profile
            </NavLink>
            <NavLink to="#" icon="help_outline">
              Help
            </NavLink>
          </nav>
          <div className="mt-auto">
            <ConnectWalletButton />
          </div>
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet /> {/* Hacker-specific pages will render here */}
        </div>
      </main>
    </div>
  );
}
