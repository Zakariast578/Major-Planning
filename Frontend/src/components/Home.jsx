import React from "react";
import axios from "axios";
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

const formSchema = z.object({
  part_time_job: z.coerce.number(),
  extracurricular_activities: z.coerce.number(),
  absence_days: z.coerce.number().min(0),
  weekly_self_study_hours: z.coerce.number().min(0),
  math_score: z.coerce.number().min(0).max(100),
  physics_score: z.coerce.number().min(0).max(100),
  chemistry_score: z.coerce.number().min(0).max(100),
  biology_score: z.coerce.number().min(0).max(100),
  english_score: z.coerce.number().min(0).max(100),
  history_score: z.coerce.number().min(0).max(100),
  geography_score: z.coerce.number().min(0).max(100),
});

const defaultValues = {
  part_time_job: 0,
  extracurricular_activities: 0,
  absence_days: 0,
  weekly_self_study_hours: 0,
  math_score: 0,
  physics_score: 0,
  chemistry_score: 0,
  biology_score: 0,
  english_score: 0,
  history_score: 0,
  geography_score: 0,
};

export default function Home() {
  const [predictions, setPredictions] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState("");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    setErrorMessage("");
    setPredictions(null);
    const payload = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, Number(value)])
    );

    try {
      const baseUrl = import.meta.env.VITE_ML_API_URL;
      const response = await axios.post(`${baseUrl}/predict`, payload);
      setPredictions(response.data);
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage("Failed to get prediction. Please try again.");
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Student Recommendation Form</CardTitle>
        </CardHeader>
        <CardContent className="max-h-[70vh] space-y-6 overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[
                  { name: "part_time_job", label: "Part-Time Job" },
                  { name: "extracurricular_activities", label: "Extracurricular Activities" },
                  { name: "absence_days", label: "Absence Days" },
                  { name: "weekly_self_study_hours", label: "Weekly Self-Study Hours" },
                ].map(({ name, label }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.5"
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
                        <FormLabel>{name.replace("_", " ").toUpperCase()}</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} max={100} step="0.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl">Prediction Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.formState.isSubmitting && (
            <p className="text-sm text-muted-foreground">Loading predictions...</p>
          )}
          {predictions ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { label: "RandomForest", value: predictions.RandomForest },
                { label: "XGBoost", value: predictions.XGBoost },
                { label: "StackingEnsemble", value: predictions.StackingEnsemble },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-lg border border-muted bg-muted/40 p-4 shadow-sm"
                >
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            !form.formState.isSubmitting && (
              <p className="text-sm text-muted-foreground">
                Submit the form to view recommendations.
              </p>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
