import React from "react";
import { Link } from "react-router-dom";
import {
  Leaf, Bot, MapPin, Clock, ShieldCheck, Users, ArrowRight,
  UploadCloud, Sparkles, Handshake, Globe2, Quote,
} from "lucide-react";

const features = [
  { icon: Bot, title: "Agentic AI Matching", desc: "An autonomous AI agent analyzes every donation and picks the best NGO — no manual searching required." },
  { icon: Clock, title: "Real-Time Urgency Scoring", desc: "Priority is calculated from expiry time so the most urgent food reaches people first." },
  { icon: MapPin, title: "Location-Aware Routing", desc: "NGOs closest to the pickup point with matching capacity are prioritized automatically." },
  { icon: ShieldCheck, title: "Secure & Verified", desc: "JWT-secured accounts and verified NGO profiles keep the donation network trustworthy." },
];

const steps = [
  { icon: UploadCloud, title: "Donor Uploads Surplus Food", desc: "Restaurants and hotels list leftover food with quantity, category and expiry details." },
  { icon: Sparkles, title: "AI Agent Analyzes & Recommends", desc: "The Food Recommendation Agent evaluates category, quantity, urgency and location." },
  { icon: Handshake, title: "NGO Accepts & Collects", desc: "The matched NGO accepts the donation and coordinates pickup." },
  { icon: Globe2, title: "Impact Tracked", desc: "Completed donations are logged, reducing waste and feeding communities." },
];

const sdgs = [
  { num: "02", title: "Zero Hunger" },
  { num: "11", title: "Sustainable Cities & Communities" },
  { num: "12", title: "Responsible Consumption & Production" },
  { num: "13", title: "Climate Action" },
];

const testimonials = [
  { name: "Priya Sharma", role: "Restaurant Manager", quote: "The AI agent found us a matching NGO within seconds of uploading surplus food." },
  { name: "Rahul Verma", role: "NGO Coordinator", quote: "We now receive donations that actually match our capacity and food preferences." },
  { name: "Anita Deshmukh", role: "Hotel Owner", quote: "Reducing food waste has never been this simple and transparent." },
];

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-200/50 blur-3xl animate-float" />
        <div className="pointer-events-none absolute -bottom-10 left-0 h-72 w-72 rounded-full bg-primary-300/30 blur-3xl animate-float" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 py-24 md:flex-row">
          <div className="flex-1 animate-slide-up">
            <span className="badge glass mb-4 text-primary-700">
              <Leaf size={14} /> Final Year CSE Project · Agentic AI
            </span>
            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
              Turning Surplus Food Into
              <span className="text-primary-600"> Hope, Automatically</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-gray-600">
              AgriSave AI connects restaurants and hotels with NGOs using an autonomous AI agent
              that decides — in real time — who should receive each donation.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary">
                Start Donating <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn How It Works
              </Link>
            </div>
          </div>

          <div className="flex-1 animate-fade-in">
            <div className="glass rounded-3xl p-6 shadow-xl">
              <div className="rounded-2xl bg-white p-6">
                <div className="mb-4 flex items-center gap-2 text-primary-700">
                  <Bot size={20} />
                  <span className="font-semibold">Food Recommendation Agent</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                    <span className="text-gray-500">Food</span>
                    <span className="font-medium">40 Veg Meals</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                    <span className="text-gray-500">Priority</span>
                    <span className="badge bg-rose-100 text-rose-700">High</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-gray-50 px-3 py-2">
                    <span className="text-gray-500">Recommended NGO</span>
                    <span className="font-medium">Helping Hands Foundation</span>
                  </div>
                  <p className="rounded-lg bg-primary-50 px-3 py-2 text-primary-700">
                    Closest NGO with capacity and suitable food requirement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Why AgriSave AI?</h2>
          <p className="mt-3 text-gray-600">Built with autonomous, agentic intelligence at its core.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <f.icon size={22} />
              </div>
              <h3 className="mb-2 font-bold text-gray-800">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-primary-50/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-3 text-gray-600">From surplus to smiles in four autonomous steps.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
                  <s.icon size={26} />
                </div>
                <div className="mb-1 text-xs font-bold text-primary-500">STEP {i + 1}</div>
                <h3 className="mb-2 font-bold text-gray-800">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDGs */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Supporting the UN SDGs</h2>
          <p className="mt-3 text-gray-600">Every donation contributes toward global sustainability goals.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sdgs.map((s) => (
            <div key={s.num} className="card flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-lg font-extrabold text-white">
                {s.num}
              </div>
              <span className="font-semibold text-gray-700">{s.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-primary-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold">What People Say</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-dark rounded-2xl p-6">
                <Quote className="mb-3 text-primary-300" size={24} />
                <p className="mb-4 text-sm text-primary-100">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-primary-300">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-14 text-white shadow-xl">
          <Users className="mx-auto mb-4" size={36} />
          <h2 className="text-3xl font-extrabold">Join the Movement Today</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-50">
            Whether you're a restaurant with surplus food or an NGO ready to help — AgriSave AI makes
            it effortless.
          </p>
          <Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-primary-700 shadow-lg transition-transform hover:scale-105">
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
