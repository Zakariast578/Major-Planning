import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Brain, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex flex-col justify-center items-center text-center px-4 py-20 overflow-hidden relative">
      {/* Animated background glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/20 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 blur-[160px] rounded-full animate-pulse" />
      </div>

      {/* Header section */}
      <motion.header
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="space-y-4 max-w-3xl z-10"
      >
        <Badge
          variant="outline"
          className="mx-auto w-fit border-cyan-400/60 bg-cyan-500/10 text-cyan-200 tracking-[0.35em] uppercase"
        >
          AI powered
        </Badge>

        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-100 leading-tight">
          Plan Your <span className="text-cyan-400">Student Major</span> with AI
        </h1>

        <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
          Choosing a major is a life-defining step. Our AI-driven model evaluates your
          academic profile and learning habits to suggest the most aligned faculties —
          guiding you toward success with data-backed predictions.
        </p>
      </motion.header>

      {/* Icons row */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="flex justify-center gap-8 mt-10 text-cyan-400"
      >
        <GraduationCap className="w-10 h-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
        <Brain className="w-10 h-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
        <Sparkles className="w-10 h-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.7 }}
        className="mt-12 flex flex-col sm:flex-row gap-4 z-10"
      >
        <Link to="/predict">
          <Button className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-8 py-4 text-white text-base rounded-2xl shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] hover:scale-[1.03] transition">
            Predict Your Major
          </Button>
        </Link>
        <Link to="/about">
          <Button className="bg-slate-800/80 text-slate-100 px-8 py-4 rounded-2xl border border-slate-700 hover:bg-slate-700/80 hover:border-cyan-400/40 transition">
            Learn More
          </Button>
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="mt-20 text-sm text-slate-500 z-10"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} AI Major Predictor. All rights reserved.</p>
          <div className="flex gap-4">
            <Link className="transition hover:text-cyan-400" to="/privacy">
              Privacy Policy
            </Link>
            <Link className="transition hover:text-cyan-400" to="/terms">
              Terms of Service
            </Link>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
