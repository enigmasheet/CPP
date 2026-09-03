// ─── Content Types ────────────────────────────────────────────
export const CONTENT_TYPES = ["mcq", "game"] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

// ─── Session Types ────────────────────────────────────────────
export const SESSION_TYPES = ["quiz", "game", "mixed"] as const;
export type SessionType = (typeof SESSION_TYPES)[number];

// ─── Difficulty Levels ────────────────────────────────────────
export const DIFFICULTY_LEVELS = ["easy", "medium", "hard"] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const RESOURCE_DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type ResourceDifficulty = (typeof RESOURCE_DIFFICULTY_LEVELS)[number];

// ─── Session Codes ────────────────────────────────────────────
export const SESSION_CODE_LENGTH = 6;
export const SESSION_CODE_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// ─── Auth ─────────────────────────────────────────────────────
export const ADMIN_TOKEN_COOKIE_NAME = "admin-token";
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const ADMIN_AUTH_STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes

// ─── Rate Limiting ────────────────────────────────────────────
export const ADMIN_LOGIN_MAX_ATTEMPTS = 5;
export const ADMIN_LOGIN_RATE_WINDOW_MS = 60_000;
export const SESSION_JOIN_MAX_ATTEMPTS = 10;
export const SESSION_JOIN_RATE_WINDOW_MS = 60_000;
export const SESSION_SUBMIT_MAX_ATTEMPTS = 10;
export const SESSION_SUBMIT_RATE_WINDOW_MS = 60_000;

// ─── Query Defaults ───────────────────────────────────────────
export const DEFAULT_MCQ_FETCH_LIMIT = 50;
export const ADMIN_MCQ_FETCH_LIMIT = 500;
export const MAX_MCQ_QUERY_LIMIT = 100;
export const DEFAULT_QUIZ_LIMIT = 10;
export const MAX_QUIZ_LIMIT = 50;
export const SESSION_CREATE_MCQ_FETCH_LIMIT = 100;

// ─── Validation Limits ────────────────────────────────────────
export const MAX_SESSION_TITLE_LENGTH = 200;
export const MAX_SECTION_LENGTH = 100;
export const MAX_STUDENT_NAME_LENGTH = 100;
export const MIN_SEARCH_QUERY_LENGTH = 2;

// ─── Search ───────────────────────────────────────────────────
export const MAX_TOPIC_SEARCH_RESULTS = 5;
export const MAX_MCQ_SEARCH_RESULTS = 5;
export const MAX_RESOURCE_SEARCH_RESULTS = 5;
export const SEARCH_SNIPPET_LENGTH = 100;
export const SEARCH_TITLE_SNIPPET_LENGTH = 80;

// ─── Time Constants ───────────────────────────────────────────
export const TIMER_INTERVAL_MS = 1000;
export const RESULTS_AUTO_REFRESH_INTERVAL_MS = 5000;
export const COPY_FEEDBACK_TIMEOUT_MS = 2000;
export const SECONDS_PER_MINUTE = 60;
export const MINUTES_TO_SECONDS = 60;
export const LOW_TIME_WARNING_SECONDS = 5;
export const DEFAULT_SPEED_CODE_TIME_LIMIT = 20;
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const ADMIN_SESSION_STALE_TIME_MS = 30 * TIMER_INTERVAL_MS;
export const SEARCH_DEBOUNCE_MS = 300;
export const STUDENT_CODE_CHAR_COUNT = 36;
export const MCQ_OPTION_PREVIEW_LENGTH = 30;
export const TOPIC_PREVIEW_HOME_COUNT = 5;
export const PROGRESS_PERCENTAGE_MULTIPLIER = 100;
export const SPEED_CODE_GREEN_THRESHOLD = 50;
export const SPEED_CODE_YELLOW_THRESHOLD = 20;

// ─── Scoring & Thresholds ─────────────────────────────────────
export const PASS_THRESHOLD_RATIO = 0.7;
export const LEADERBOARD_HIGH_THRESHOLD = 70;
export const LEADERBOARD_MEDIUM_THRESHOLD = 50;
export const ANALYTICS_HIGH_THRESHOLD = 70;
export const ANALYTICS_MEDIUM_THRESHOLD = 40;
export const DEFAULT_GAME_TOTAL_QUESTIONS = 5;
export const MAX_SCORE_PERCENTAGE = 100;

// ─── Time Bonus ───────────────────────────────────────────────
export const TIME_BONUS_HALF_TIME_RATIO = 0.5;
export const MIN_TIME_BONUS = 0.5;
export const MAX_TIME_BONUS = 1;

// ─── Display ──────────────────────────────────────────────────
export const ASCII_UPPERCASE_A = 65;
export const SIDEBAR_WIDTH = "w-80";
export const CSV_PREVIEW_MAX_ROWS = 10;

// ─── Difficulty Colors ────────────────────────────────────────
export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

// ─── Game Types ───────────────────────────────────────────────
export const GAME_TYPES = [
  { id: "output-predictor", name: "Output Predictor", description: "Predict C++ program output", implemented: true },
  { id: "bug-hunter", name: "Bug Hunter", description: "Find bugs in code snippets", implemented: true },
  { id: "speed-code", name: "Speed Code", description: "Race against time to code", implemented: true },
] as const;

// ─── Audit Statuses ───────────────────────────────────────────
export const AUDIT_STATUSES = ["planned", "completed", "skipped"] as const;
export type AuditStatus = (typeof AUDIT_STATUSES)[number];

// ─── Plan Statuses ────────────────────────────────────────────
export const PLAN_STATUSES = ["todo", "in_progress", "done", "skipped"] as const;
export type PlanStatus = (typeof PLAN_STATUSES)[number];

export const PLAN_STATUS_TRANSITIONS: Record<string, string> = {
  todo: "in_progress",
  in_progress: "done",
};

// ─── Plan Priorities ──────────────────────────────────────────
export const PLAN_PRIORITIES = ["low", "medium", "high"] as const;
export type PlanPriority = (typeof PLAN_PRIORITIES)[number];

// ─── Knowledge Categories ─────────────────────────────────────
export const KNOWLEDGE_CATEGORY_IDS = ["all", "bugs", "tricky", "teaching", "reference"] as const;

// ─── Code Highlighting ────────────────────────────────────────
export const DEFAULT_CODE_LANGUAGE = "cpp";
export const DEFAULT_CODE_THEME = "dark";
export const SHIKI_THEME_DARK = "github-dark";
export const SHIKI_THEME_LIGHT = "github-light";

// ─── Fallbacks ────────────────────────────────────────────────
export const DEFAULT_SUBJECT = "unknown";
export const DEFAULT_TOPIC = "general";
export const DEFAULT_MCQ_DIFFICULTY: DifficultyLevel = "medium";
export const DEFAULT_SESSION_CREATOR = "teacher";
export const DEFAULT_MONGODB_URI = "mongodb://localhost:27017/cpp-cms";
export const MONGODB_MAX_POOL_SIZE = 10;
export const COOKIE_CLEAR_MAX_AGE = 0;

// ─── URLs ─────────────────────────────────────────────────────
export const API_PATHS = {
  ADMIN_VERIFY: "/api/admin/verify",
  ADMIN_AUTH: "/api/admin/auth",
  ADMIN_LOGOUT: "/api/admin/logout",
  SESSIONS: "/api/sessions",
  MCQ: "/api/mcq",
  AUDIT: "/api/audit",
  PLANS: "/api/plans",
  QUIZ_START: "/api/quiz/start",
  GAMES: "/api/games",
  SEARCH: "/api/search",
  RESOURCES: "/api/resources",
} as const;

export function sessionApiPath(code: string) {
  return `/api/sessions/${code}`;
}

export function sessionResultsApiPath(code: string) {
  return `/api/sessions/${code}/results`;
}

export function sessionDetailPath(code: string) {
  return `/admin/sessions/${code}`;
}

export function studentSessionPath(code: string) {
  return `/s/${code}`;
}

export function topicLearnPath(slug: string, topic: string) {
  return `/subjects/${slug}/learn/${topic}`;
}

export function topicMcqPath(slug: string, topic: string) {
  return `/subjects/${slug}/mcq/${topic}`;
}
