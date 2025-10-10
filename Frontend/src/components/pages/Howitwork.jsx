import React from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    BarChart3,
    BrainCircuit,
    ClipboardCheck,
    Database,
    GaugeCircle,
    Settings2,
    Server,
    Sparkle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const workflowSteps = [
    {
        icon: ClipboardCheck,
        label: "Profile Intake",
        title: "Collect the student signal",
        description:
            "Grades, study hours, absences, and extracurriculars are validated and assembled into a rich profile.",
    },
    {
        icon: Settings2,
        label: "Feature Engineering",
        title: "Design the learning features",
        description:
            "Totals, science vs. arts averages, and study efficiency metrics amplify the predictive power of raw scores.",
    },
    {
        icon: BrainCircuit,
        label: "Model Training",
        title: "Fit ensemble models",
        description:
            "Random Forest and XGBoost learn class boundaries on SMOTE-balanced data, with a stacking head exploring complementarity.",
    },
    {
        icon: BarChart3,
        label: "Evaluation",
        title: "Stress-test every faculty",
        description:
            "Macro-averaged precision, recall, and F1 reveal how each faculty fares, protecting minority outcomes from being overlooked.",
    },
    {
        icon: Server,
        label: "Deployment",
        title: "Serve predictions via API",
        description:
            "A FastAPI endpoint loads the best pipeline and returns the predicted faculty plus top-three alternatives and probabilities.",
    },
    {
        icon: GaugeCircle,
        label: "Decision Support",
        title: "Guide confident choices",
        description:
            "Students review ranked recommendations with transparent confidence scores before connecting with advisors.",
    },
];

const pipelineStages = [
    {
        icon: Database,
        title: "Dataset",
        detail: "1,777 curated student profiles derived from the Kaggle Student Scores corpus after cleaning unknown aspirations.",
    },
    {
        icon: Settings2,
        title: "Preprocess",
        detail: "Standardize numeric features, encode aspirations into nine faculties, and rebalance with SMOTE for fair learning.",
    },
    {
        icon: BrainCircuit,
        title: "Model",
        detail: "Train Random Forest (1,000 trees, balanced weights) and tuned XGBoost (~500 estimators) before stacking.",
    },
    {
        icon: BarChart3,
        title: "Evaluate",
        detail: "Benchmark on a held-out test split: XGBoost macro F1 = 0.43, stacking accuracy = 0.59, plus sanity checks.",
    },
    {
        icon: Server,
        title: "Deliver",
        detail: "FastAPI exposes /predict, returning recommendation JSON consumed by the Vite React frontend.",
    },
];

const HowItWorks = () => {
    return (
        <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-16 text-slate-100">
            <div className="mx-auto flex max-w-6xl flex-col gap-16">
                <motion.header
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="space-y-4 text-center"
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400/80">
                        How It Works
                    </p>
                    <h1 className="text-4xl font-bold sm:text-5xl">
                        From Raw Scores to Faculty Confidence in Six Steps
                    </h1>
                    <p className="mx-auto max-w-3xl text-base text-slate-300 sm:text-lg">
                        The Planning Student Major pipeline translates student profiles into faculty recommendations using
                        engineered features, ensemble learning, and a lightweight FastAPI service.
                    </p>
                </motion.header>

                <div className="grid gap-6 md:grid-cols-2">
                    {workflowSteps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }}
                        >
                            <Card className="h-full rounded-3xl border border-slate-800/70 bg-slate-950/70 shadow-[0_35px_120px_-60px_rgba(56,189,248,0.6)] backdrop-blur">
                                <CardHeader className="space-y-3">
                                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
                                        <step.icon className="h-6 w-6" />
                                    </span>
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400/80">
                                        {`0${index + 1}`} · {step.label}
                                    </p>
                                    <CardTitle className="text-lg font-semibold text-slate-100">
                                        {step.title}
                                    </CardTitle>
                                    <CardDescription className="text-sm leading-relaxed text-slate-300">
                                        {step.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="rounded-3xl border border-slate-800/70 bg-slate-950/80 p-8 shadow-[0_45px_140px_-70px_rgba(14,165,233,0.55)] backdrop-blur"
                >
                    <div className="space-y-6 text-center">
                        <h2 className="text-2xl font-semibold text-slate-100">Pipeline Timeline</h2>
                        <p className="mx-auto max-w-3xl text-sm text-slate-300">
                            Each stage reuses the same cleaned dataset, ensuring the recommendation that students receive in the
                            UI mirrors the exact process described in the project reflection.
                        </p>
                    </div>
                    <div className="mt-8 grid gap-4 md:grid-cols-5">
                        {pipelineStages.map((stage, index) => (
                            <motion.div
                                key={stage.title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
                                className="flex flex-col gap-3 rounded-2xl border border-slate-800/70 bg-slate-950/60 p-5 text-center"
                            >
                                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                                    <stage.icon className="h-5 w-5" />
                                </span>
                                <h3 className="text-sm font-semibold text-slate-100">{stage.title}</h3>
                                <p className="text-xs text-slate-300 leading-relaxed">{stage.detail}</p>
                                {index < pipelineStages.length - 1 && (
                                    <ArrowRight className="mx-auto mt-1 h-4 w-4 text-cyan-300/60" />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="grid gap-6 lg:grid-cols-[1fr_0.8fr]"
                >
                    <Card className="rounded-3xl border border-slate-800/70 bg-slate-950/70">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-cyan-300">
                                <Sparkle className="h-5 w-5" />
                                What students experience
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-slate-300 leading-relaxed">
                            <p>
                                Students submit a profile in the Prediction form. The frontend calls <code>/predict</code>, receives
                                faculty rankings, and renders top-three matches alongside the model responsible. Confidence chips and
                                total score reminders keep the conversation grounded in transparent metrics.
                            </p>
                            <p>
                                Advisors can use the same response payload to discuss alternatives, highlight strengths, and plan
                                next steps. Because the backend is stateless, holding a session simply requires resubmitting the profile.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border border-slate-800/70 bg-slate-950/70">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-cyan-300">
                                Key metrics at a glance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-slate-300">
                            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
                                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400/80">Macro F1 leader</p>
                                <p className="text-base font-semibold text-slate-100">XGBoost · 0.43</p>
                                <p className="text-xs text-slate-400">
                                    Balanced precision-recall across Engineering & Technology, Business & Economics, and Medicine & Health.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
                                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400/80">Accuracy peak</p>
                                <p className="text-base font-semibold text-slate-100">Stacking Ensemble · 0.59</p>
                                <p className="text-xs text-slate-400">
                                    Highest overall accuracy, supported by Random Forest + XGBoost base learners.
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
                                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400/80">Focus areas</p>
                                <p className="text-xs text-slate-400">
                                    Continue enhancing minority faculty recall (e.g., Law, Arts) with cost-sensitive strategies and more
                                    representative data.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.section>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex justify-center"
                >
                    <Button
                        asChild
                        className="rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-10 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950 shadow-[0_40px_90px_-55px_rgba(14,165,233,0.95)] transition hover:scale-[1.015] hover:shadow-[0_48px_120px_-60px_rgba(14,165,233,1)]"
                    >
                        <Link to="/predict">Launch the Predictor</Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
