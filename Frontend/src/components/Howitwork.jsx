import React from "react";
import { motion } from "framer-motion";
import {
    Workflow,
    Brain,
    ArrowRightCircle,
    FileInput,
    BookOpen,
    SlidersHorizontal,
    BrainCircuit,
    GraduationCap,
    Target,
    Lightbulb,
    BarChart3,
    Rocket,
    ArrowRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const steps = [
    {
        icon: FileInput,
        number: "01",
        title: "Input Student Data",
        description: "Students enter scores, extracurriculars, study hours, and aspirations for analysis.",
    },
    {
        icon: SlidersHorizontal,
        number: "02",
        title: "Data Preprocessing",
        description: "The pipeline cleans, normalizes, and balances features to ensure consistent quality.",
    },
    {
        icon: BrainCircuit,
        number: "03",
        title: "ML Prediction",
        description: "Advanced models evaluate fit across faculties, producing probability-driven insights.",
    },
    {
        icon: GraduationCap,
        number: "04",
        title: "Faculty Recommendation",
        description: "Students receive the top faculty matches with confidence scores and guidance.",
    },
];

const flowNodes = [
    { icon: FileInput, title: "Student Input", description: "Scores, activities, goals" },
    { icon: BrainCircuit, title: "ML Engine", description: "Model inference & evaluation" },
    { icon: GraduationCap, title: "Faculty Output", description: "Personalized matches" },
];

const whyPoints = [
    { icon: Target, label: "Precision matching tailored to student profiles." },
    { icon: Lightbulb, label: "Actionable guidance built on transparent modeling." },
    { icon: BarChart3, label: "Data-backed insights for confident decisions." },
    { icon: Rocket, label: "Accelerated journey to the ideal faculty path." },
];

const reveal = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
    viewport: { once: true, amount: 0.3 },
};

const HowItWork = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 " id='how-it-works'>
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 px-6 py-24 text-white md:px-12 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="mx-auto flex max-w-5xl flex-col items-center text-center"
                >
                    <div className="flex items-center gap-4 text-indigo-100">
                        <motion.span whileHover={{ scale: 1.1 }} className="rounded-full bg-white/10 p-3">
                            <Workflow className="h-6 w-6" />
                        </motion.span>
                        <motion.span whileHover={{ scale: 1.1 }} className="rounded-full bg-white/10 p-3">
                            <Brain className="h-6 w-6" />
                        </motion.span>
                        <motion.span whileHover={{ scale: 1.1 }} className="rounded-full bg-white/10 p-3">
                            <ArrowRightCircle className="h-6 w-6" />
                        </motion.span>
                    </div>
                    <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                        How It Works
                    </h1>
                    <p className="mt-6 max-w-3xl text-lg text-white/80 sm:text-xl">
                        From student data to intelligent faculty recommendations — powered by Machine Learning.
                    </p>
                </motion.div>
                <div className="pointer-events-none absolute inset-0 opacity-30">
                    <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
                </div>
            </section>

            {/* Steps */}
            <section className="px-6 py-20 md:px-12 lg:px-20">
                <motion.div {...reveal} className="mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl font-extrabold text-slate-900">Step-by-Step Intelligence</h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Every phase is crafted to translate your profile into a precise faculty recommendation.
                    </p>
                </motion.div>
                <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <Card className="group relative h-full overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-lg backdrop-blur transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/40 via-transparent to-purple-200/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <CardHeader className="relative space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-600">
                                            {step.number}
                                        </span>
                                        <step.icon className="h-8 w-8 text-indigo-500 transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                    <CardTitle className="text-xl font-semibold text-indigo-700">
                                        {step.title}
                                    </CardTitle>
                                    <CardDescription className="text-base leading-relaxed text-slate-600">
                                        {step.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Flow Diagram */}
            <section className="px-6 py-20 md:px-12 lg:px-20">
                <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
                    <h2 className="text-4xl font-extrabold text-slate-900">Visual Workflow</h2>
                    <p className="mt-4 text-lg text-slate-600">
                        A seamless journey from raw inputs to actionable recommendations.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="mt-16 rounded-3xl bg-white/70 p-10 shadow-lg backdrop-blur"
                >
                    <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
                        {flowNodes.map((node, index) => (
                            <React.Fragment key={node.title}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.15, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="flex w-full max-w-xs flex-col items-center rounded-2xl border border-slate-200 bg-white/80 px-6 py-8 text-center shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <node.icon className="h-10 w-10 text-indigo-600" />
                                    <h3 className="mt-4 text-xl font-semibold text-slate-900">{node.title}</h3>
                                    <p className="mt-2 text-sm text-slate-600">{node.description}</p>
                                </motion.div>
                                {index < flowNodes.length - 1 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: index * 0.15 + 0.1, duration: 0.4 }}
                                        viewport={{ once: true }}
                                        className="hidden items-center md:flex"
                                    >
                                        <ArrowRight className="h-10 w-10 text-indigo-400" />
                                    </motion.div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Why It Matters */}
            <section className="px-6 py-20 md:px-12 lg:px-20">
                <div className="grid gap-12 md:grid-cols-2 md:items-center">
                    <motion.div {...reveal}>
                        <h2 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                            Why It Matters
                        </h2>
                        <p className="mt-6 text-lg leading-relaxed text-slate-600">
                            Planning a student’s academic journey demands precision and empathy. By coupling curated
                            datasets with machine learning, the system elevates guidance beyond intuition, presenting
                            transparent recommendations grounded in evidence. Students gain clarity, administrators gain
                            confidence, and the pathway to academic fulfillment becomes unmistakably clear.
                        </p>
                    </motion.div>
                    <motion.ul
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="space-y-6"
                    >
                        {whyPoints.map((point) => (
                            <li
                                key={point.label}
                                className="flex items-start gap-4 rounded-2xl border border-indigo-100 bg-white/80 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                            >
                                <point.icon className="mt-1 h-8 w-8 text-indigo-500" />
                                <span className="text-base font-medium text-slate-700">{point.label}</span>
                            </li>
                        ))}
                    </motion.ul>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-16 md:px-12 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 p-10 text-center text-white shadow-2xl"
                >
                    <h3 className="text-3xl font-bold">Discover your perfect faculty path today.</h3>
                    <p className="mt-4 text-lg text-white/80">
                        Experience intelligent recommendations that align your strengths with the right academic future.
                    </p>
                    <motion.div whileHover={{ scale: 1.03 }} className="mt-8 inline-flex">
                        <Button variant="default" className="rounded-full bg-white px-8 py-3 text-indigo-600 shadow-lg transition-all duration-300 hover:bg-white/90 hover:shadow-2xl">
                            Try Now
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="px-6 pb-10 md:px-12 lg:px-20">
                <div className="rounded-2xl bg-white/80 px-6 py-8 text-center text-sm text-slate-500 shadow-inner">
                    © 2025 Planning Student Major | Built with ❤️ using React &amp; FastAPI.
                </div>
            </footer>
        </div>
    );
};

export default HowItWork;
