import React from "react"
import { motion } from "framer-motion"
import {
    Brain,
    GraduationCap,
    Sparkles,
    BarChart,
    BookOpen,
    Target,
    LineChart,
    LayoutDashboard,
    Globe2,
    User,
} from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

const fadeIn = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
}

const features = [
    {
        icon: Brain,
        title: "AI Faculty Recommendation",
        description:
            "Personalized matches between students and faculty mentors powered by predictive models.",
    },
    {
        icon: LineChart,
        title: "Performance-Based Analytics",
        description:
            "Transforms academic data into actionable insights tailored to every learner’s strengths.",
    },
    {
        icon: LayoutDashboard,
        title: "Interactive Dashboard",
        description:
            "Unified command center to explore recommendations, track progress, and compare pathways.",
    },
    {
        icon: Globe2,
        title: "Accessible Anywhere",
        description:
            "Cloud-enabled access ensures seamless guidance for students across any device or location.",
    },
    {
        icon: Sparkles,
        title: "Dynamic Insights",
        description:
            "Continuously refreshed intelligence keeps guidance aligned with evolving academic goals.",
    },
    {
        icon: Target,
        title: "Goal-Oriented Planning",
        description:
            "Aligns student aspirations with faculty expertise for intentional academic journeys.",
    },
]

const About = () => {
    return (
        <div id="about" className="min-h-screen bg-slate-50">
            <section className="relative isolate overflow-hidden rounded-b-[3rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-900 px-6 py-24 text-white shadow-[0_40px_120px_-50px_rgba(15,40,120,0.8)] sm:px-12 md:px-20">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute -left-16 top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
                </div>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="mx-auto max-w-4xl text-center"
                >
                    <div className="mb-6 flex items-center justify-center gap-3">
                        <GraduationCap className="h-10 w-10 text-white drop-shadow-2xl" />
                        <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-[0.35em] text-indigo-100">
                            Planning Student Major
                        </span>
                    </div>
                    <motion.h1
                        variants={fadeIn}
                        className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl"
                    >
                        Planning Student Major – An ML-Based Faculty Recommendation System
                    </motion.h1>
                    <motion.p
                        variants={fadeIn}
                        className="mt-6 text-lg text-indigo-100 sm:text-xl"
                    >
                        Empowering students with intelligent faculty recommendations through AI-driven insights.
                    </motion.p>
                </motion.div>
            </section>

            <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-20 sm:px-12">
                <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeIn}>
                    <Card className="rounded-2xl border border-slate-200 bg-white/80 shadow-xl backdrop-blur">
                        <CardHeader className="space-y-2 pb-4">
                            <CardTitle className="flex items-center gap-3 text-3xl font-semibold text-slate-900">
                                <Brain className="h-8 w-8 text-indigo-600" />
                                About the Project
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 text-slate-700">
                            <p className="text-lg text-slate-600">
                                Planning Student Major is a refined decision-support platform that guides students toward their ideal academic path by aligning aspirations with data-backed faculty expertise.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <BarChart className="mt-1 h-5 w-5 text-indigo-600" />
                                    <span>Transforms academic performance trends into personalized mentorship pathways.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <BookOpen className="mt-1 h-5 w-5 text-indigo-600" />
                                    <span>Curates tailored content and faculty profiles that resonate with student goals.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Target className="mt-1 h-5 w-5 text-indigo-600" />
                                    <span>Focuses on long-term success by recommending optimal faculty collaboration opportunities.</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.section>

                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={stagger}
                    className="space-y-10"
                >
                    <div className="text-center">
                        <motion.h2 variants={fadeIn} className="text-4xl font-bold text-slate-900">
                            Key Features
                        </motion.h2>
                        <motion.p variants={fadeIn} className="mt-3 text-lg text-slate-600">
                            Crafted to deliver clarity, confidence, and meaningful academic choices.
                        </motion.p>
                    </div>
                    <motion.div
                        variants={stagger}
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {features.map(({ icon: Icon, title, description }) => (
                            <motion.div key={title} variants={fadeIn}>
                                <Card className="group h-full rounded-2xl border border-slate-200 bg-white/80 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                                    <CardContent className="flex h-full flex-col gap-4 p-6">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                                        <p className="text-sm text-slate-600">{description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.section>

                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeIn}
                    className="space-y-8"
                >
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-slate-900">Team & Contributors</h2>
                        <p className="mt-3 text-lg text-slate-600">
                            Visionaries shaping the future of student success.
                        </p>
                    </div>
                    <div className="mx-auto max-w-xl">
                        <Card className="rounded-2xl border border-slate-200 bg-white/80 shadow-md transition-all duration-300 hover:-translate-y-1 hover:rotate-[0.5deg] hover:shadow-2xl">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                                    <User className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900">Zakaria Said</h3>
                                    <p className="text-sm text-slate-600">Lead Developer</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </motion.section>
            </main>

            
        </div>
    )
}

export default About
