import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
        <Leaf size={30} />
      </span>
      <h1 className="text-6xl font-extrabold text-primary-600">404</h1>
      <p className="mt-2 text-lg font-semibold text-gray-700">Page Not Found</p>
      <p className="mt-1 max-w-md text-sm text-gray-500">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        <Home size={18} /> Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
