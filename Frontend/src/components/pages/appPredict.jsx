import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_ML_API_URL;

const booleanOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

const numericFieldRules = {
  weekly_self_study_hours: {
    required: "Weekly Self-study Hours required",
    min: { value: 1, message: "Minimum 1 hour" },
    max: { value: 36, message: "Maximum 36 hours" },
  },
  absence_days: {
    required: "Absence days is required",
    min: { value: 1, message: "Minimum 1 day" },
    max: { value: 36, message: "Maximum 36 days" },
  },
};

const scoreRules = {
  required: "Score is required",
  min: { value: 50, message: "Minimum 50" },
  max: { value: 100, message: "Maximum 100" },
};

export default function PredictionForm() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      part_time_job: "",
      extracurricular_activities: "",
      absence_days: "",
      weekly_self_study_hours: "",
      math_score: "",
      physics_score: "",
      chemistry_score: "",
      biology_score: "",
      english_score: "",
      history_score: "",
      geography_score: "",
    },
  });

  const onSubmit = async (formData) => {
    const payload = {
      ...formData,
      part_time_job: formData.part_time_job === "Yes" ? 1 : 0,
      extracurricular_activities:
        formData.extracurricular_activities === "Yes" ? 1 : 0,
    };

    try {
      setLoading(true);
      const { data } = await axios.post(`${API_URL}/predict`, payload);
      setPrediction(data);
    } catch (error) {
      console.error(error);
      alert("⚠️ Error fetching prediction. Please check your API or network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16 px-4 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <h1 className="text-4xl font-bold">Student Major Prediction</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Enter academic metrics to forecast your most suitable university
            faculty using trained ML models.
          </p>
        </motion.header>

        {/* FORM */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 shadow-[0_35px_120px_-60px_rgba(56,189,248,0.6)] backdrop-blur"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Boolean Fields */}
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {["part_time_job", "extracurricular_activities"].map(
                  (fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName}
                      rules={{
                        required: `${fieldName
                          .replace("_", " ")
                          .toUpperCase()} is required`,
                      }}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-slate-200 text-sm">
                            {fieldName
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="bg-slate-800/70 border-slate-700 text-slate-100">
                                <SelectValue placeholder="Select Yes or No" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 text-slate-100 border-slate-700">
                                {booleanOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="text-rose-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>

              {/* Numeric Fields */}
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {["absence_days", "weekly_self_study_hours"].map(
                  (fieldName) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName}
                      rules={numericFieldRules[fieldName]}
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-slate-200 text-sm">
                            {fieldName
                              .replace("_", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className="bg-slate-800/70 border-slate-700 text-slate-100 focus-visible:border-cyan-400 focus-visible:ring-cyan-400/20"
                            />
                          </FormControl>
                          <FormMessage className="text-rose-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>

              {/* Score Fields */}
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {[
                  "math",
                  "physics",
                  "chemistry",
                  "biology",
                  "english",
                  "history",
                  "geography",
                ].map((subject) => (
                  <FormField
                    key={subject}
                    control={form.control}
                    name={`${subject}_score`}
                    rules={{
                      ...scoreRules,
                      required: `${subject
                        .charAt(0)
                        .toUpperCase()}${subject.slice(1)} score is required`,
                    }}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-slate-200 text-sm">
                          {subject.charAt(0).toUpperCase() +
                            subject.slice(1)}{" "}
                          Score
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className="bg-slate-800/70 border-slate-700 text-slate-100 focus-visible:border-cyan-400 focus-visible:ring-cyan-400/20"
                          />
                        </FormControl>
                        <FormMessage className="text-rose-400 text-xs" />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 shadow-lg hover:scale-[1.015] hover:shadow-[0_25px_80px_-35px_rgba(14,165,233,1)] transition"
              >
                {loading ? "Predicting..." : "Predict"}
              </Button>
            </form>
          </Form>
        </motion.div>

        {/* LOADING ANIMATION */}
        {loading && (
          <div className="flex justify-center items-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-400 border-b-4"></div>
            <span className="ml-4 text-cyan-400 text-lg font-semibold">
              Fetching prediction...
            </span>
          </div>
        )}

        {/* PREDICTION RESULT */}
        {!loading && prediction && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3"
  >
    {Object.entries(prediction.predictions).map(([modelName, result], index) => (
      <motion.div
        key={modelName}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15, duration: 0.6 }}
      >
        <Card className="bg-slate-950 border border-cyan-600/30 shadow-[0_20px_60px_-30px_rgba(56,189,248,0.4)] hover:scale-[1.02] transition-transform">
          <CardHeader>
            <CardTitle className="text-cyan-400 text-lg flex items-center justify-between">
              <span className="capitalize">{modelName.replace(/_/g, " ")}</span>
              <span className="text-xs text-slate-400">Model</span>
            </CardTitle>
            <CardDescription className="text-slate-100 text-base font-semibold">
              🎯 Predicted Faculty:{" "}
              <span className="text-cyan-400">{result.predicted_faculty}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            {result.top_n && result.top_n.length > 0 ? (
              <ul className="space-y-2">
                {result.top_n.map((item, idx) => (
                  <li
                    key={idx}
                    className={`flex justify-between items-center px-4 py-2 rounded-xl transition-all ${
                      idx === 0
                        ? "bg-cyan-500/20 text-white font-semibold"
                        : "bg-slate-800/70 hover:bg-slate-700/60 text-slate-300"
                    }`}
                  >
                    <span>{item.faculty}</span>
                    <span className="text-cyan-400 font-semibold">
                      {item.probability.toFixed(2)}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-sm italic">
                No detailed predictions available.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </motion.div>
)}


        {!loading && !prediction && (
          <div className="text-center text-sm text-slate-400">
            ⚙️ Predictions are based on trained data and provide advisory insights only.
          </div>
        )}
      </div>
    </section>
  );
}
