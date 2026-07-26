if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "collabhub_production_jwt_secret_key_2026_default";
    console.warn("⚠️ JWT_SECRET missing. Used auto-generated fallback key.");
}

if (!process.env.MONGO_URI) {
    console.error("⚠️ WARNING: MONGO_URI environment variable is missing!");
}