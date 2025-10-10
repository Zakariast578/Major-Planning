import React from "react"
import { Link } from "react-router-dom"
import { Brain, Database, LineChart, Network, Server, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const About = () => {
    return (
        <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-16 sm:px-8 text-slate-200">
            <div className="mx-auto flex max-w-6xl flex-col gap-12">
                <header className="space-y-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400/80">
                        Planning Student Major
                    </p>
                    <h1 className="text-4xl font-bold sm:text-5xl">
                        Bringing Data-Backed Confidence to Major Selection
                    </h1>
                    <p className="mx-auto max-w-3xl text-base text-slate-300 sm:text-lg">
                        "Planning Student Major" is a machine learning–powered recommender that compares a student’s
                        academic record, study patterns, and activities against historical outcomes to suggest the
                        university faculty where they are most likely to thrive. The platform returns a ranked
                        short-list with transparent confidence scores, helping students move from uncertainty toward
                        decisive action.
                    </p>
                </header>

                <Card className="rounded-3xl border border-slate-800/70 bg-slate-950/80 shadow-[0_35px_120px_-45px_rgba(14,165,233,0.4)] backdrop-blur">
                    <CardHeader className="pb-0">
                        <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-cyan-400">
                            <Brain className="h-8 w-8" />
                            What Problem Are We Solving?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-12 py-10 text-slate-300 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-6 text-base leading-relaxed">
                            <p>
                                Choosing a faculty is often guided by intuition rather than evidence. Our research shows that
                                connecting strengths, study habits, and aspirations to the right academic track gives students
                                a measurable boost in confidence. The recommender analyzes each profile and surfaces the best-fit
                                faculties along with alternatives, so students and advisors can have constructive, data-informed
                                conversations.
                            </p>
                            <p>
                                The system is fueled by the synthetic "Student Scores" dataset (2,000 seniors). After cleaning and
                                removing unknown aspirations, 1,777 records remained, spanning academic performance, study behavior,
                                and extracurricular engagement. Features such as <code>Total_Score</code>, science/arts averages, and
                                study efficiency amplify the signal beyond raw subject marks.
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-8 text-center shadow-inner">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/80 to-indigo-500/80 text-slate-900 shadow-lg">
                                <Sparkles className="h-10 w-10" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-100">High-Level Snapshot</h2>
                            <ul className="space-y-2 text-sm text-slate-300">
                                <li>• 1,777 curated student profiles</li>
                                <li>• 9 mapped faculty outcomes</li>
                                <li>• Feature scaling + SMOTE for balance</li>
                                <li>• FastAPI backend + Vite frontend</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-8 lg:grid-cols-2">
                    <Card className="rounded-3xl border border-slate-800/60 bg-slate-950/70">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-cyan-300">
                                <Database className="h-6 w-6" />
                                Dataset & Feature Pipeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm leading-relaxed text-slate-300">
                            <p>
                                We engineered features that capture holistic performance and study effort. <code>Total_Score</code>
                                and domain averages (science vs. arts) spotlight academic strengths, while study-efficiency metrics
                                highlight dedication. Unknown aspirations were removed, granular career goals were mapped to nine
                                faculty clusters, and numerical features were standardized.
                            </p>
                            <p>
                                To address class imbalance, SMOTE upsamples underrepresented faculties before model fitting. The
                                cleaned corpus ships as <code>cleaned-student-scores.csv</code>, ensuring reproducible training runs.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border border-slate-800/60 bg-slate-950/70">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-cyan-300">
                                <LineChart className="h-6 w-6" />
                                Modeling & Evaluation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm leading-relaxed text-slate-300">
                            <p>
                                We framed the task as multi-class classification. Random Forest (1,000 trees, class-balanced) and
                                XGBoost (~500 estimators) served as the core models, while a stacking ensemble explored estimator
                                complementarity with a Gradient Boosting meta-learner.
                            </p>
                            <p>
                                XGBoost delivered the best macro F1 (0.43), reflecting balanced precision and recall across faculties.
                                The stacking ensemble pushed overall accuracy to 0.59, though its recall dipped on minority classes—
                                underscoring the importance of macro metrics when classes are imbalanced.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <Card className="rounded-3xl border border-slate-800/60 bg-slate-950/70">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-cyan-300">
                                <Server className="h-6 w-6" />
                                Deployment & API
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm leading-relaxed text-slate-300">
                            <p>
                                A FastAPI service exposes a <code>/predict</code> endpoint. It loads the persisted models and label encoder,
                                accepts JSON payloads, and returns the predicted faculty plus the top three alternatives with
                                probabilities. This keeps integration lightweight for web and advisor dashboards.
                            </p>
                            <p className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-4 font-mono text-xs text-cyan-200/90">
{`POST /predict
{
  "part_time_job": 0,
  "absence_days": 3,
  "weekly_self_study_hours": 15,
  "math_score": 85,
  "Total_Score": 578,
  ...
}`}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border border-slate-800/60 bg-slate-950/70">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-cyan-300">
                                <Network className="h-6 w-6" />
                                Lessons Learned & Next Steps
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm leading-relaxed text-slate-300">
                            <ul className="space-y-2">
                                <li>• Data quality dominates: SMOTE helped, yet Law and Arts remain challenging.</li>
                                <li>• Feature engineering (totals, domain averages, study-efficiency) drove major gains.</li>
                                <li>• Macro metrics mattered more than accuracy for honest performance comparisons.</li>
                                <li>• Future work: interaction features, Bayesian tuning, SHAP explanations, calibrated probabilities.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-center pt-4">
                    <Button
                        asChild
                        className="rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-8 py-6 text-sm font-semibold tracking-wide text-slate-950 shadow-[0_30px_55px_-35px_rgba(14,165,233,0.95)] transition hover:scale-[1.01] hover:shadow-[0_40px_70px_-40px_rgba(14,165,233,1)]"
                    >
                        <Link to="/predict">Try the Predictor</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default About
