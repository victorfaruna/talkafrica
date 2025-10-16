
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
		RouteId(): "/" | "/admin" | "/admin/login" | "/admin/posts" | "/admin/posts/new" | "/api" | "/api/auth" | "/api/auth/login" | "/api/auth/logout" | "/api/donate" | "/api/posts" | "/api/upload" | "/donate" | "/posts" | "/posts/[post_id]" | "/[category]";
		RouteParams(): {
			"/posts/[post_id]": { post_id: string };
			"/[category]": { category: string }
		};
		LayoutParams(): {
			"/": { post_id?: string; category?: string };
			"/admin": Record<string, never>;
			"/admin/login": Record<string, never>;
			"/admin/posts": Record<string, never>;
			"/admin/posts/new": Record<string, never>;
			"/api": Record<string, never>;
			"/api/auth": Record<string, never>;
			"/api/auth/login": Record<string, never>;
			"/api/auth/logout": Record<string, never>;
			"/api/donate": Record<string, never>;
			"/api/posts": Record<string, never>;
			"/api/upload": Record<string, never>;
			"/donate": Record<string, never>;
			"/posts": { post_id?: string };
			"/posts/[post_id]": { post_id: string };
			"/[category]": { category: string }
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/admin/login" | "/admin/login/" | "/admin/posts" | "/admin/posts/" | "/admin/posts/new" | "/admin/posts/new/" | "/api" | "/api/" | "/api/auth" | "/api/auth/" | "/api/auth/login" | "/api/auth/login/" | "/api/auth/logout" | "/api/auth/logout/" | "/api/donate" | "/api/donate/" | "/api/posts" | "/api/posts/" | "/api/upload" | "/api/upload/" | "/donate" | "/donate/" | "/posts" | "/posts/" | `/posts/${string}` & {} | `/posts/${string}/` & {} | `/${string}` & {} | `/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/fonts/ClashGrotesk/ClashGrotesk-Bold.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Bold.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Bold.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Bold.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Extralight.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Extralight.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Extralight.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Extralight.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Light.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Light.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Light.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Light.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Medium.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Medium.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Medium.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Medium.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Regular.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Regular.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Regular.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Regular.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Semibold.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Semibold.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Semibold.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Semibold.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Variable.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Variable.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Variable.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Variable.woff2" | "/images/category/news.webp" | "/images/eee.png" | "/images/eee.webp" | "/images/founder.webp" | "/images/hero/ta-1.jpeg" | "/images/hero/ta-2.jpeg" | "/images/hero/ta-3.jpeg" | "/images/hero/ta-4.jpeg" | "/images/hero/ta-5.jpeg" | "/images/hero/ta-6.jpeg" | "/images/hero/ta-7.jpeg" | "/images/hero/ta-8.jpeg" | "/images/logo-1.webp" | "/images/op.webp" | "/images/placeholder.jpeg" | "/images/placeholder.webp" | "/images/uploads/1759693286674.jpeg" | "/images/uploads/1759698171564.jpeg" | "/images/uploads/1759735010088.jpeg" | "/images/uploads/1759735387474.jpg" | "/images/uploads/1759739637895.jpg" | "/images/uploads/1759741073911.jpg" | "/images/uploads/1759741159818.jpg" | string & {};
	}
}