import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center items-center text-center px-4 py-16">
            <header className="space-y-4 max-w-3xl">
                <Badge variant="outline" className="mx-auto w-fit border-cyan-400/60 bg-cyan-500/10 text-cyan-200 tracking-[0.35em] uppercase">
                    AI powered
                </Badge>
                <h1 className="text-5xl font-bold text-slate-100">Planning Student Major</h1>
                <p className="text-lg text-slate-300">
                    Choosing a major is a high‑stakes decision that shapes a student’s academic path and early career.
                    Our ML-powered recommender helps you align your strengths and interests with suitable faculties,
                    providing top predictions and ranked alternatives with confidence scores.
                </p>
            </header>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/predict">
                    <Button className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-6 py-3 text-white rounded-2xl shadow-lg hover:scale-[1.015] transition">
                        Predict Your Major
                    </Button>
                </Link>
                <Link to="/about">
                    <Button className="bg-slate-700/80 text-slate-100 px-6 py-3 rounded-2xl shadow hover:bg-slate-600/70 transition">
                        Learn More
                    </Button>
                </Link>
            </div>

            <footer className="mt-16 text-sm text-slate-500">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-slate-500 sm:flex-row">
                    <p>© {new Date().getFullYear()} AI Major Predictor. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link className="transition hover:text-white" to="/privacy">Privacy Policy</Link>
                        <Link className="transition hover:text-white" to="/terms">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
