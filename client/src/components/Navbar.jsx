import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const dashboardPath = {
  admin: "/admin-dashboard",
  donor: "/donor-dashboard",
  ngo: "/ngo-dashboard",
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-primary-700">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Leaf size={20} />
          </span>
          AgriSave AI
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="font-medium text-gray-700 hover:text-primary-700">
              {l.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                to={dashboardPath[user.role] || "/"}
                className="flex items-center gap-1 font-medium text-gray-700 hover:text-primary-700"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link to="/profile" className="font-medium text-gray-700 hover:text-primary-700">
                Profile
              </Link>
              <button onClick={handleLogout} className="btn-secondary !py-2">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !py-2">
                Login
              </Link>
              <Link to="/register" className="btn-primary !py-2">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-3 border-t border-gray-100 bg-white px-6 py-4 md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="font-medium text-gray-700">
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to={dashboardPath[user.role] || "/"} onClick={() => setOpen(false)} className="font-medium text-gray-700">
                Dashboard
              </Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="font-medium text-gray-700">
                Profile
              </Link>
              <button onClick={handleLogout} className="btn-secondary w-full">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary w-full">
                Login
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
