import { load as loadHomepage } from "../+page.server";
import type { PageServerLoad } from "./$types";

// Keep an explicit route load so SvelteKit infers the shared homepage data.
export const load = (async (event) => loadHomepage(event)) satisfies PageServerLoad;
