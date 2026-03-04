import Link from "next/link";
import { TrendingUp, Zap, BarChart3, Newspaper } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-10 w-10 rounded-xl bg-brand-600 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">NeuralTrade</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
            NeuralTrade
          </h1>
          <p className="text-lg text-gray-600 font-medium mb-1">Predict market reactions before they happen</p>
          <p className="text-base text-gray-500">
            Run thousands of Monte Carlo simulations to forecast how real-world
            news events will impact your stock portfolio.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 text-left">
          {[
            { icon: Newspaper, label: "Live News", desc: "Auto-pull latest news for your stocks" },
            { icon: Zap, label: "AI Analysis", desc: "LLM-powered impact assessment" },
            { icon: BarChart3, label: "Simulations", desc: "Probabilistic price forecasts" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="rounded-xl bg-white border border-gray-100 p-3 shadow-sm">
              <Icon className="h-4 w-4 text-brand-600 mb-1.5" />
              <p className="text-xs font-semibold text-gray-800">{label}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors shadow-sm"
        >
          Start Analysis →
        </Link>
      </div>
    </main>
  );
}
