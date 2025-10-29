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
    title: "Capture the student profile",
    description:
      "The API receives structured inputs — scores, study hours, absences, and activities — to build a comprehensive learning signature.",
  },
  {
    icon: Settings2,
    label: "Feature Engineering",
    title: "Craft smart academic signals",
    description:
      "Features like science-to-humanities ratios, study efficiency, and self-study indicators amplify raw input meaning.",
  },
  {
    icon: BrainCircuit,
    label: "Model Training",
    title: "Train stacked ensemble learners",
    description:
      "Random Forest, XGBoost, and a Stacking Ensemble are tuned to capture nuanced relationships between profile traits and ideal faculties.",
  },
  {
    icon: BarChart3,
    label: "Evaluation",
    title: "Validate and stress-test models",
    description:
      "Performance metrics such as accuracy, macro F1, and recall ensure every faculty prediction is balanced and fair.",
  },
  {
    icon: Server,
    label: "Deployment",
    title: "Serve predictions via FastAPI",
    description:
      "The trained ensemble runs inside a FastAPI service, exposing `/predict` for real-time recommendations.",
  },
  {
    icon: GaugeCircle,
    label: "Decision Support",
    title: "Deliver ranked faculty suggestions",
    description:
      "The frontend visualizes top predictions with probabilities, empowering confident academic choices.",
  },
];

const pipelineStages = [
  {
    icon: Database,
    title: "Dataset",
    detail:
      "1,777 cleaned student profiles derived from the Kaggle Student Scores dataset — refined for realistic academic behavior.",
  },
  {
    icon: Settings2,
    title: "Preprocess",
    detail:
      "Numeric normalization, categorical encoding, and SMOTE balancing maintain equity across all faculty classes.",
  },
  {
    icon: BrainCircuit,
    title: "Model",
    detail:
      "Random Forest (1,000 trees) and XGBoost (~500 estimators) are blended with a meta-learner for optimal stacking performance.",
  },
  {
    icon: BarChart3,
    title: "Evaluate",
    detail:
      "On the test split: XGBoost macro F1 = 0.43 · Stacking Ensemble accuracy = 0.59, ensuring consistent generalization.",
  },
  {
    icon: Server,
    title: "Deliver",
    detail:
      "FastAPI exposes `/predict`, delivering structured JSON consumed by the React frontend in real time.",
  },
];

const HowItWorks = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-16 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        {/* Header */}
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
            From Student Scores to Faculty Insights
          </h1>
          <p className="mx-auto max-w-3xl text-base text-slate-300 sm:text-lg">
            The Student Major Recommendation System transforms academic patterns into faculty
            suggestions using ensemble learning and transparent probabilities — all powered by FastAPI.
          </p>
        </motion.header>

        {/* Workflow Cards */}
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

        {/* Pipeline Section */}
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
              Each stage reuses the same dataset and feature logic used in training, ensuring the
              frontend’s predictions mirror backend reality.
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

        {/* Results + Metrics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="grid gap-6 lg:grid-cols-[1fr_0.8fr]"
        >
          {/* Left: Experience */}
          <Card className="rounded-3xl border border-slate-800/70 bg-slate-950/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-cyan-300">
                <Sparkle className="h-5 w-5" />
                Student Interaction Flow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                The frontend collects input, posts it to <code>/predict</code>, and displays ranked
                faculties with model-wise confidence. Students explore results visually with
                progress animations and clarity.
              </p>
              <p>
                Each prediction includes top 3 recommendations and confidence percentages, helping
                both students and advisors make data-informed discussions about academic direction.
              </p>
            </CardContent>
          </Card>

          {/* Right: Metrics */}
          <Card className="rounded-3xl border border-slate-800/70 bg-slate-950/70">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-cyan-300">
                Model Metrics Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400/80">Macro F1 Leader</p>
                <p className="text-base font-semibold text-slate-100">XGBoost · 0.43</p>
                <p className="text-xs text-slate-400">
                  Delivers balanced performance across Science, Business, and Health faculties.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400/80">Accuracy Peak</p>
                <p className="text-base font-semibold text-slate-100">Stacking Ensemble · 0.59</p>
                <p className="text-xs text-slate-400">
                  Combines Random Forest and XGBoost for stable, high-accuracy predictions.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-400/80">Next Steps</p>
                <p className="text-xs text-slate-400">
                  Future upgrades: faculty-specific fine-tuning and contextual reinforcement
                  learning for more personalized guidance.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Button */}
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
            <Link to="/predict">Launch Predictor</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
