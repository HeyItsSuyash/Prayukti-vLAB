import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const getBackendConfig = () => {
    const config: Record<string, string | undefined> = {};

    // Iterate over all env vars
    for (const key in process.env) {
        // If it starts with BACKEND_, strip the prefix and add to config
        if (key.startsWith('BACKEND_')) {
            const strippedKey = key.replace(/^BACKEND_/, '');
            config[strippedKey] = process.env[key];
        }
    }

    // Explicitly fallback for PORT if not prefixed (standard practice for hosting providers)
    if (process.env.PORT) {
        config.PORT = process.env.PORT;
    }

    return config;
};

const env = getBackendConfig();

export default env;
