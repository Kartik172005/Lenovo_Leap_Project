import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Github, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-primary-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white">
              <Leaf size={20} />
            </span>
            AgriSave AI
          </Link>
          <p className="mt-3 text-sm text-primary-200">
            Agentic AI Smart Food Waste Management System — connecting surplus food with the people
            who need it most.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm text-primary-200">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/register" className="hover:text-white">Become a Donor</Link></li>
            <li><Link to="/register" className="hover:text-white">Join as NGO</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Sustainable Development Goals</h4>
          <ul className="space-y-2 text-sm text-primary-200">
            <li>SDG 2 — Zero Hunger</li>
            <li>SDG 11 — Sustainable Cities</li>
            <li>SDG 12 — Responsible Consumption</li>
            <li>SDG 13 — Climate Action</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Contact</h4>
          <ul className="space-y-2 text-sm text-primary-200">
            <li className="flex items-center gap-2"><Mail size={16} /> support@agrisave.ai</li>
            <li className="flex items-center gap-2"><MapPin size={16} /> Final Year CSE Project</li>
            <li className="flex items-center gap-2"><Github size={16} /> github.com/agrisave-ai</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-800 py-5 text-center text-xs text-primary-300">
        © {new Date().getFullYear()} AgriSave AI · Agentic AI Smart Food Waste Management System
      </div>
    </footer>
  );
};

export default Footer;
