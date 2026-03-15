/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_TMDB_API_KEY?: string;
	readonly VITE_GEMINI_API_KEY?: string;
	readonly VITE_SUPABASE_PROJECT_ID?: string;
	readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}