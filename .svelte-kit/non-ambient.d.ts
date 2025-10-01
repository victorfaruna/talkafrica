
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/auth" | "/api/auth/login" | "/api/auth/logout" | "/api/donate" | "/api/posts" | "/donate" | "/[category]";
		RouteParams(): {
			"/[category]": { category: string }
		};
		LayoutParams(): {
			"/": { category?: string };
			"/api": Record<string, never>;
			"/api/auth": Record<string, never>;
			"/api/auth/login": Record<string, never>;
			"/api/auth/logout": Record<string, never>;
			"/api/donate": Record<string, never>;
			"/api/posts": Record<string, never>;
			"/donate": Record<string, never>;
			"/[category]": { category: string }
		};
		Pathname(): "/" | "/api" | "/api/" | "/api/auth" | "/api/auth/" | "/api/auth/login" | "/api/auth/login/" | "/api/auth/logout" | "/api/auth/logout/" | "/api/donate" | "/api/donate/" | "/api/posts" | "/api/posts/" | "/donate" | "/donate/" | `/${string}` & {} | `/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/fonts/ClashGrotesk/ClashGrotesk-Bold.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Bold.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Bold.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Bold.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Extralight.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Extralight.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Extralight.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Extralight.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Light.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Light.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Light.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Light.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Medium.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Medium.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Medium.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Medium.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Regular.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Regular.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Regular.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Regular.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Semibold.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Semibold.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Semibold.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Semibold.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Variable.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Variable.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Variable.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Variable.woff2" | "/images/category/news.webp" | "/images/eee.png" | "/images/eee.webp" | "/images/founder.webp" | "/images/hero/ta-1.jpeg" | "/images/hero/ta-2.jpeg" | "/images/hero/ta-3.jpeg" | "/images/hero/ta-4.jpeg" | "/images/hero/ta-5.jpeg" | "/images/hero/ta-6.jpeg" | "/images/hero/ta-7.jpeg" | "/images/hero/ta-8.jpeg" | "/images/op.webp" | string & {};
	}
}