import React from "react";
import { Bot, Target, Layers, Cpu } from "lucide-react";

const stack = [
  { group: "Frontend", items: ["React.js", "Tailwind CSS", "React Router", "Axios"] },
  { group: "Backend", items: ["Node.js", "Express.js", "JWT Auth"] },
  { group: "Database", items: ["MongoDB", "Mongoose"] },
  { group: "AI Layer", items: ["Python", "FastAPI", "OpenAI GPT / Gemini"] },
  { group: "Media", items: ["Cloudinary Image Storage"] },
];

const About = () => {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12 text-center">
        <span className="badge bg-primary-50 text-primary-700">About the Project</span>
        <h1 className="mt-4 text-4xl font-extrabold text-gray-900">
          Agentic AI Smart Food Waste Management System
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          A final-year Computer Science Engineering project demonstrating how autonomous AI agents
          can solve real-world sustainability problems by intelligently matching surplus food
          donations with the NGOs best equipped to use them.
        </p>
      </div>

      <div className="mb-16 grid gap-6 md:grid-cols-3">
        <div className="card">
          <Target className="mb-3 text-primary-600" size={26} />
          <h3 className="mb-2 font-bold text-gray-800">The Problem</h3>
          <p className="text-sm text-gray-500">
            Tonnes of edible food go to waste daily while NGOs struggle to find reliable, timely
            donations that match their capacity and needs.
          </p>
        </div>
        <div className="card">
          <Bot className="mb-3 text-primary-600" size={26} />
          <h3 className="mb-2 font-bold text-gray-800">The Agentic Solution</h3>
          <p className="text-sm text-gray-500">
            Our Food Recommendation Agent autonomously analyzes each donation's category, quantity,
            urgency and location to decide the best NGO — without human intervention.
          </p>
        </div>
        <div className="card">
          <Layers className="mb-3 text-primary-600" size={26} />
          <h3 className="mb-2 font-bold text-gray-800">The Impact</h3>
          <p className="text-sm text-gray-500">
            Faster matches mean less spoilage, more meals delivered, and measurable progress toward
            UN Sustainable Development Goals.
          </p>
        </div>
      </div>

      <div className="mb-16">
        <div className="mb-6 flex items-center gap-2">
          <Cpu className="text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Technology Stack</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((s) => (
            <div key={s.group} className="card">
              <h4 className="mb-3 font-semibold text-primary-700">{s.group}</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {s.items.map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">How the AI Agent Decides</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-600">
          <li>Reads the donation's food category, quantity, preparation and expiry time.</li>
          <li>Calculates urgency priority — High, Medium, or Low — from time remaining until expiry.</li>
          <li>Scores every verified NGO on category match, available capacity, and distance from pickup location.</li>
          <li>Selects the highest-scoring NGO and generates a human-readable reason for the match.</li>
          <li>Assigns the donation automatically so the NGO can accept, reject, or complete it.</li>
        </ol>
      </div>
    </div>
  );
};

export default About;
