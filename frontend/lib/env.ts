/**
 * Strict Environment Loader for Frontend (Server-Side)
 * 
 * This utility is for API Routes (Node.js runtime) to safely load
 * FRONTEND_ prefixed variables from the process environment.
 * 
 * It ensures that even if next.config.js mapping doesn't apply to the specific
 * runtime context (e.g. serverless function isolation), we can still
 * access the variables if they are present in the environment as strictly scoped keys.
 */
const getFrontendConfig = () => {
    const config: Record<string, string | undefined> = {};

    // 1. First, try to load standard next.config.inlined keys if they exist
    // (This covers cases where standard process.env.KEY works)
    if (process.env.SMTP_HOST) config.SMTP_HOST = process.env.SMTP_HOST;
    if (process.env.SMTP_USER) config.SMTP_USER = process.env.SMTP_USER;
    if (process.env.SMTP_PASS) config.SMTP_PASS = process.env.SMTP_PASS;
    if (process.env.SMTP_PORT) config.SMTP_PORT = process.env.SMTP_PORT;
    if (process.env.GROQ_API_KEY) config.GROQ_API_KEY = process.env.GROQ_API_KEY;

    // 2. Then, override/fill with strict FRONTEND_ keys from the raw process.env
    // This handles the case where only FRONTEND_XXX is set in the runtime env
    if (process.env.FRONTEND_SMTP_HOST) config.SMTP_HOST = process.env.FRONTEND_SMTP_HOST;
    if (process.env.FRONTEND_SMTP_USER) config.SMTP_USER = process.env.FRONTEND_SMTP_USER;
    if (process.env.FRONTEND_SMTP_PASS) config.SMTP_PASS = process.env.FRONTEND_SMTP_PASS;
    if (process.env.FRONTEND_SMTP_PORT) config.SMTP_PORT = process.env.FRONTEND_SMTP_PORT;
    if (process.env.FRONTEND_GROQ_API_KEY) config.GROQ_API_KEY = process.env.FRONTEND_GROQ_API_KEY;

    return config;
};

const env = getFrontendConfig();

export default env;
