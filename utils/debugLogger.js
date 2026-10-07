
const isDev = process.env.NODE_ENV !== "production";

const SENSITIVE = [
  "password",
  "newpassword",
  "currentpassword",
  "token",
  "otp",
  "authorization",
  "cookie",
];

const clean = (data) => {
  if (typeof data !== "object" || data === null) return data;
  if (Array.isArray(data)) return data.map(clean);

  const copy = {};
  for (const [key, value] of Object.entries(data)) {
    const isSecret = SENSITIVE.some((s) => key.toLowerCase().includes(s));
    copy[key] = isSecret ? "***REDACTED***" : clean(value);
  }
  return copy;
};

export const debug = {
  log: (...args) => {
    if (!isDev) return;
    console.log(...args.map(clean));
  },
  error: (...args) => {
    console.error(...args.map(clean));
  },
  warn: (...args) => {
    if (!isDev) return;
    console.warn(...args.map(clean));
  },
};