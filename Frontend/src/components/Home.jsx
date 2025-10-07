import React from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

const numberField = (label) =>
  z
    .string()
    .min(1, `${label} is required.`)
    .refine((value) => !Number.isNaN(Number(value)), `${label} must be a number.`)
    .transform((value) => Number(value))
    .refine((value) => value >= 0, `${label} must be at least 0.`)
    .refine((value) => value <= 100, `${label} must be 100 or less.`);

const formSchema = z.object({
  part_time_job: z
    .string()
    .nonempty("Please choose Yes or No.")
    .refine((val) => ["0", "1"].includes(val), "Invalid option selected."),
  extracurricular_activities: z
    .string()
    .nonempty("Please choose Yes or No.")
    .refine((val) => ["0", "1"].includes(val), "Invalid option selected."),
  absence_days: z
    .string()
    .nonempty("Absence days are required.")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 20,
      "Absence days"
    ),
  weekly_self_study_hours: z
    .string()
    .nonempty("Weekly self-study hours are required.")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 30,
      "Weekly self-study hours"
    ),
  math_score: z
    .string()
    .nonempty("Math score is required.")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100,
      "Math score"
    ),
  physics_score: z
    .string()
    .nonempty("Physics score is required.")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100,
      "Physics score"
    ),
  chemistry_score: z
    .string()
    .nonempty("Chemistry score is required.")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100,
      "Chemistry score"
    ),
  biology_score: z
    .string()
    .nonempty("Biology score is required.")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100,
      "Biology score"
    ),
  english_score: z
    .string()
    .nonempty("English score is required.")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100,
      "English score"
    ),
  history_score: z
    .string()
    .nonempty("History score is required.")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100,
      "History score"
    ),
  geography_score: z
    .string()
    .nonempty("Geography score is required.")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100,
      "Geography score"
    ),
});

const defaultValues = {
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
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 0.84, 0.44, 1], delay: 0.1 },
  },
};

const staggerCards = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const gradientLineStyle = {
  background:
    "linear-gradient(90deg, rgba(59,130,246,1), rgba(79,70,229,1), rgba(168,85,247,1))",
  backgroundSize: "200% 200%",
};

const listItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 0.84, 0.44, 1] },
  },
};

export default function Home() {
  const [predictions, setPredictions] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState("");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const onSubmit = async (values) => {
    setErrorMessage("");
    setPredictions(null);

    const payload = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, Number(value)])
    );

    try {
      const baseUrl = import.meta.env.VITE_ML_API_URL;
      const { data } = await axios.post(`${baseUrl}/predict`, payload);
      setPredictions(data);
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage("Failed to get prediction. Please try again.");
    }
  };

  return (
    <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 mt-6">
      <motion.section
        id="home"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-10 text-white shadow-2xl"
      >
        <div className="absolute inset-0 overflow-hidden">
          <span className="absolute -top-10 left-10 h-40 w-40 rounded-full bg-white/20 blur-3xl opacity-80 animate-ping" />
          <span className="absolute bottom-10 right-0 h-52 w-52 rounded-full bg-purple-500/30 blur-2xl opacity-80 animate-[pulse_6s_ease-in-out_infinite]" />
          <span className="absolute -bottom-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-blue-400/30 blur-3xl animate-[spin_18s_linear_infinite]" />
        </div>
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 0.84, 0.44, 1], delay: 0.15 }}
            className="space-y-4"
          >
            <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">
              Empowering Students with Intelligent Faculty Recommendations
            </h1>
            <p className="max-w-xl text-sm text-slate-100 md:text-base">
              Discover your academic path through AI-driven insights.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 shadow-lg backdrop-blur-md transition-transform hover:scale-110 hover:rotate-3"
          >
            <Brain className="h-14 w-14 text-white drop-shadow-lg" />
          </motion.div>
        </div>
      </motion.section>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerCards}
        className="grid gap-8 md:grid-cols-2"
      >
        <motion.div
          variants={fadeInUp}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
          className="relative"
        >
          <Card className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/90 shadow-xl backdrop-blur-md">
            <motion.div
              style={gradientLineStyle}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 top-0 h-1"
            />
            <CardHeader>
              <CardTitle className="text-3xl font-extrabold text-slate-900">
                Student Recommendation Form
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[70vh] space-y-6 overflow-y-auto pr-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  noValidate
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="part_time_job"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-slate-700">
                            Part-Time Job
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 transition-transform duration-300 hover:scale-105">
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Yes</SelectItem>
                              <SelectItem value="0">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="extracurricular_activities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-slate-700">
                            Extracurricular Activities
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 transition-transform duration-300 hover:scale-105">
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Yes</SelectItem>
                              <SelectItem value="0">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {[
                      { name: "absence_days", label: "Absence Days" },
                      {
                        name: "weekly_self_study_hours",
                        label: "Weekly Self-Study Hours",
                      },
                    ].map(({ name, label }) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700">
                              {label}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.5"
                                className="h-10 transition-transform duration-300 hover:scale-[1.03]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[
                      "math_score",
                      "physics_score",
                      "chemistry_score",
                      "biology_score",
                      "english_score",
                      "history_score",
                      "geography_score",
                    ].map((name) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-slate-700">
                              {name.replace("_", " ").toUpperCase()}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                step="0.5"
                                className="h-10 transition-transform duration-300 hover:scale-[1.03]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  <Button
                    type="submit"
                    className="w-full transform rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white transition-transform duration-300 hover:scale-110 hover:-rotate-1 md:w-auto"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </form>
              </Form>
              {errorMessage && (
                <p className="text-sm font-medium text-red-600">{errorMessage}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
          className="relative"
        >
          <Card className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/90 shadow-xl backdrop-blur-md">
            <motion.div
              style={gradientLineStyle}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 top-0 h-1"
            />
            <CardHeader>
              <CardTitle className="text-3xl font-extrabold text-slate-900">
                Prediction Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.formState.isSubmitting && (
                <p className="text-sm text-slate-500">Loading predictions...</p>
              )}

              {!form.formState.isSubmitting && !predictions && (
                <p className="text-sm text-slate-500">
                  Submit the form to view recommendations.
                </p>
              )}

              {predictions && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerCards}
                  className="grid grid-cols-1 gap-6 md:grid-cols-3"
                >
                  {Object.entries(predictions).map(([modelName, modelData]) => {
                    const sortedTop = [...modelData.top_n].sort(
                      (a, b) => b.probability - a.probability
                    );
                    return (
                      <motion.div
                        key={modelName}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02 }}
                        className="relative rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-md transition-shadow hover:shadow-2xl"
                      >
                        <motion.div
                          className="absolute inset-0 rounded-2xl border border-transparent"
                          animate={{
                            boxShadow: [
                              "0 0 0 rgba(99,102,241,0.2)",
                              "0 0 25px rgba(99,102,241,0.35)",
                              "0 0 0 rgba(99,102,241,0.2)",
                            ],
                          }}
                          transition={{ duration: 6, repeat: Infinity }}
                        />
                        <div className="relative space-y-3">
                          <h3 className="text-lg font-semibold text-blue-700">
                            {modelName}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Recommended Faculty
                          </p>
                          <p className="text-base font-semibold text-green-700">
                            {modelData.predicted_faculty}
                          </p>

                          <h4 className="text-sm font-semibold text-slate-600">
                            Top 3 Faculties
                          </h4>
                          <motion.ul
                            initial="hidden"
                            animate="visible"
                            variants={staggerCards}
                            className="mt-2 space-y-2"
                          >
                            {sortedTop.map((item, idx) => (
                              <motion.li
                                key={`${item.faculty}-${idx}`}
                                variants={listItemVariants}
                                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-transform hover:-translate-y-1 ${
                                  idx === 0
                                    ? "border-green-200 bg-green-100 font-semibold text-green-900 shadow-[0_0_18px_rgba(74,222,128,0.45)] animate-[pulse_5s_ease-in-out_infinite]"
                                    : "border-slate-200 bg-slate-50 text-slate-700"
                                }`}
                              >
                                <span className="pr-2">{item.faculty}</span>
                                <span>{item.probability.toFixed(1)}%</span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
