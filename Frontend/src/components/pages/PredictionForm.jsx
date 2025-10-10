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
      alert("Error fetching prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-4" id="predict">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <header className="text-center text-slate-100 space-y-2">
          <h1 className="text-4xl font-bold">Student Major Prediction</h1>
          <p className="text-sm text-slate-300">
            Enter academic metrics to forecast the best-fit faculty using multiple ML models.
          </p>
        </header>

        {/* Form */}
        <div className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-8 shadow-[0_25px_80px_-35px_rgba(15,23,42,1)] backdrop-blur">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Boolean Fields */}
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {["part_time_job", "extracurricular_activities"].map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName}
                    rules={{ required: `${fieldName.replace("_", " ")} is required` }}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-slate-200 text-sm">
                          {fieldName.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="bg-slate-800/70 border-slate-700 text-slate-100">
                              <SelectValue placeholder="Select Yes or No" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 text-slate-100 border-slate-700">
                              {booleanOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
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
                ))}

                {/* Numeric Fields */}
                {["absence_days", "weekly_self_study_hours"].map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName}
                    rules={numericFieldRules[fieldName]}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-slate-200 text-sm">
                          {fieldName.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step={fieldName === "weekly_self_study_hours" ? "0.1" : "1"}
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

              {/* Score Fields */}
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {["math", "physics", "chemistry", "biology", "english", "history", "geography"].map((subject) => (
                  <FormField
                    key={subject}
                    control={form.control}
                    name={`${subject}_score`}
                    rules={{
                      ...scoreRules,
                      required: `${subject.charAt(0).toUpperCase() + subject.slice(1)} score is required`,
                    }}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-slate-200 text-sm">
                          {subject.charAt(0).toUpperCase() + subject.slice(1)} Score
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition hover:scale-[1.015] hover:shadow-[0_20px_45px_-25px_rgba(59,130,246,0.9)] focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:opacity-60"
              >
                <span className="relative">{loading ? "Predicting..." : "Predict"}</span>
              </Button>
            </form>
          </Form>
        </div>

        {/* Prediction Results */}
        {prediction && (
          <div className="space-y-6">
            <h2 className="text-slate-200 text-lg font-semibold">Prediction Result</h2>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {Object.entries(prediction).map(([model, result]) => (
                <div
                  key={model}
                  className="group rounded-3xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-[0_20px_60px_-40px_rgba(59,130,246,0.9)] transition hover:border-cyan-400/70 hover:shadow-[0_25px_90px_-45px_rgba(56,189,248,0.65)]"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-100">{model}</h3>
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                      Confidence
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">
                    Predicted Faculty:{" "}
                    <span className="font-semibold text-slate-100">{result.predicted_faculty}</span>
                  </p>
                  <p className="text-sm text-slate-300">
                    Total Score: <span className="font-semibold text-cyan-300">{result.Total_Score}</span>
                  </p>
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-semibold text-slate-200">Top 3 Probabilities</h4>
                    <ul className="space-y-1 rounded-2xl border border-slate-800/80 bg-slate-950/30 p-3 text-sm text-slate-300">
                      {result.top_n.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between rounded-xl bg-slate-900/50 px-3 py-2"
                        >
                          <span>{item.faculty}</span>
                          <span className="font-semibold text-cyan-300">{item.probability.toFixed(2)}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
