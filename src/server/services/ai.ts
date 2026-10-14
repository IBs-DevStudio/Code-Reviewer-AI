import OpenAI from "openai";
import { z } from "zod";

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    "X-Title": "CodeReviewer",
  },
});

export const reviewCommentSchema = z.object({
  file: z.string(),
  line: z.number().nullable().optional(),
  severity: z.enum(["critical", "high", "medium", "low"]),
  category: z.enum(["bug", "security", "performance", "style", "test"]),
  message: z.string(),
  suggestion: z.string().optional(),
});

export const reviewResultSchema = z.object({
  summary: z.string(),
  riskScore: z.number().min(0).max(100),
  comments: z.array(reviewCommentSchema),
});

export type ReviewResult = z.infer<typeof reviewResultSchema>;
export type ReviewComment = z.infer<typeof reviewCommentSchema>;

const MAX_DIFF_CHARS = 60_000;

const SYSTEM_PROMPT = `You are an expert code reviewer. Analyze the provided pull request diff and provide a structured review.
Identify bugs, security vulnerabilities, performance regressions, and style issues.
Assign an overall risk score from 0 (completely safe) to 100 (critical danger/breaking changes).
Respond with ONLY valid JSON, no markdown, matching this shape:
{
  "summary": "Brief 1-3 sentence summary of the changes and quality",
  "riskScore": 0-100,
  "comments": [
    {
      "file": "path/to/file",
      "line": 12,
      "severity": "critical" | "high" | "medium" | "low",
      "category": "bug" | "security" | "performance" | "style" | "test",
      "message": "Explanation of the issue",
      "suggestion": "Optional concrete fix"
    }
  ]
}`;

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced?.[1] ?? text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("Model did not return JSON");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

interface ReviewCodeOptions {
  prTitle: string;
  filesChanged: {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    patch?: string;
  }[];
}

export async function reviewCode({
  prTitle,
  filesChanged,
}: ReviewCodeOptions): Promise<ReviewResult> {
  const diffContent = filesChanged
    .filter((file) => Boolean(file.patch))
    .map((file) => `File: ${file.filename}\nDiff:\n${file.patch}`)
    .join("\n\n---\n\n")
    .slice(0, MAX_DIFF_CHARS);

  if (!diffContent.trim()) {
    return {
      summary: "No inspectable code changes found (binary or empty diff).",
      riskScore: 0,
      comments: [],
    };
  }

  const completion = await openrouter.chat.completions.create({
    model: process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Pull Request Title: ${prTitle}\n\nFiles and Diffs:\n${diffContent}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("No response returned from the model");
  }

  return reviewResultSchema.parse(extractJson(raw));
}