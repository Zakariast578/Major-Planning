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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const API_URL = import.meta.env.VITE_ML_API_URL;

const booleanOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

const numericFieldRules = {
  weekly_self_study_hours: { required: "Weekly Self-study Hours required", min: { value: 1, message: "Minimum 1 hour" }, max: { value: 36, message: "Maximum 36 hours" } },
  absence_days: { required: "Absence days is required", min: { value: 1, message: "Minimum 1 day" }, max: { value: 36, message: "Maximum 36 days" } },
};

const scoreRules = { required: "Score is required", min: { value: 50, message: "Minimum 50" }, max: { value: 100, message: "Maximum 100" } };

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
      extracurricular_activities: formData.extracurricular_activities === "Yes" ? 1 : 0,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-4">
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
                          {fieldName.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                          {fieldName.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                    rules={{ ...scoreRules, required: `${subject.charAt(0).toUpperCase() + subject.slice(1)} score is required` }}
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

        {/* ------------------------- */}
{/* Prediction Results */}
{/* ------------------------- */}
{loading && (
  <div className="flex justify-center items-center mt-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-400 border-b-4"></div>
    <span className="ml-4 text-cyan-400 text-lg font-semibold">
      Prediction results...
    </span>
  </div>
)}

{!loading && prediction && (
  <div className="space-y-6 mt-6">
    {Object.entries(prediction.predictions).map(([name, result]) => (
      <Card
        key={name}
        className="bg-slate-900 border border-cyan-700/40 shadow-lg"
      >
        <CardHeader>
          <CardTitle className="text-cyan-400">Recommended Faculty</CardTitle>
          <CardDescription className="text-slate-300 font-bold">
            {result.predicted_faculty}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result.top_n?.length > 0 && (
            <ul className="space-y-2">
              {result.top_n.map((item, idx) => (
                <li
                  key={idx}
                  className={`flex justify-between items-center px-4 py-2 rounded-lg transition-colors ${
                    idx === 0
                      ? "bg-cyan-500/20 font-bold text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <span>{item.faculty}</span>
                  <span className="font-semibold text-cyan-400">
                    {(item.probability).toFixed(2)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
)}


        {!loading && !prediction && (
          <div className="text-center text-sm text-slate-400 mt-4">
            Note: Predictions are based on historical data and may not guarantee future outcomes.
          </div>
        )}
      </div>
    </div>
  );
}
