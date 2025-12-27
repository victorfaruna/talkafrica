
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
		RouteId(): "/" | "/about" | "/admin" | "/admin/categories" | "/admin/login" | "/admin/posts" | "/admin/posts/new" | "/african-giant" | "/api" | "/api/auth" | "/api/auth/login" | "/api/auth/logout" | "/api/categories" | "/api/comments" | "/api/donate" | "/api/posts" | "/api/seed-categories" | "/api/test-supabase" | "/api/upload" | "/api/users" | "/donate" | "/posts" | "/posts/[post_id]" | "/[category]";
		RouteParams(): {
			"/posts/[post_id]": { post_id: string };
			"/[category]": { category: string }
		};
		LayoutParams(): {
			"/": { post_id?: string; category?: string };
			"/about": Record<string, never>;
			"/admin": Record<string, never>;
			"/admin/categories": Record<string, never>;
			"/admin/login": Record<string, never>;
			"/admin/posts": Record<string, never>;
			"/admin/posts/new": Record<string, never>;
			"/african-giant": Record<string, never>;
			"/api": Record<string, never>;
			"/api/auth": Record<string, never>;
			"/api/auth/login": Record<string, never>;
			"/api/auth/logout": Record<string, never>;
			"/api/categories": Record<string, never>;
			"/api/comments": Record<string, never>;
			"/api/donate": Record<string, never>;
			"/api/posts": Record<string, never>;
			"/api/seed-categories": Record<string, never>;
			"/api/test-supabase": Record<string, never>;
			"/api/upload": Record<string, never>;
			"/api/users": Record<string, never>;
			"/donate": Record<string, never>;
			"/posts": { post_id?: string };
			"/posts/[post_id]": { post_id: string };
			"/[category]": { category: string }
		};
		Pathname(): "/" | "/about" | "/about/" | "/admin" | "/admin/" | "/admin/categories" | "/admin/categories/" | "/admin/login" | "/admin/login/" | "/admin/posts" | "/admin/posts/" | "/admin/posts/new" | "/admin/posts/new/" | "/african-giant" | "/african-giant/" | "/api" | "/api/" | "/api/auth" | "/api/auth/" | "/api/auth/login" | "/api/auth/login/" | "/api/auth/logout" | "/api/auth/logout/" | "/api/categories" | "/api/categories/" | "/api/comments" | "/api/comments/" | "/api/donate" | "/api/donate/" | "/api/posts" | "/api/posts/" | "/api/seed-categories" | "/api/seed-categories/" | "/api/test-supabase" | "/api/test-supabase/" | "/api/upload" | "/api/upload/" | "/api/users" | "/api/users/" | "/donate" | "/donate/" | "/posts" | "/posts/" | `/posts/${string}` & {} | `/posts/${string}/` & {} | `/${string}` & {} | `/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.ico" | "/fonts/ClashGrotesk/ClashGrotesk-Bold.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Bold.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Bold.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Bold.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Extralight.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Extralight.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Extralight.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Extralight.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Light.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Light.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Light.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Light.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Medium.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Medium.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Medium.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Medium.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Regular.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Regular.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Regular.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Regular.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Semibold.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Semibold.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Semibold.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Semibold.woff2" | "/fonts/ClashGrotesk/ClashGrotesk-Variable.eot" | "/fonts/ClashGrotesk/ClashGrotesk-Variable.ttf" | "/fonts/ClashGrotesk/ClashGrotesk-Variable.woff" | "/fonts/ClashGrotesk/ClashGrotesk-Variable.woff2" | "/images/category/arts.webp" | "/images/category/business.webp" | "/images/category/culture.webp" | "/images/category/innovation.webp" | "/images/category/lifestyle.webp" | "/images/category/music.webp" | "/images/category/news.webp" | "/images/category/sport.webp" | "/images/category/travel.webp" | "/images/eee.png" | "/images/eee.webp" | "/images/founder.webp" | "/images/headshot-001.jpeg" | "/images/headshot-001.webp" | "/images/hero/ta-1.jpeg" | "/images/hero/ta-10.jpg" | "/images/hero/ta-11.jpg" | "/images/hero/ta-12.jpg" | "/images/hero/ta-13.jpg" | "/images/hero/ta-14.jpg" | "/images/hero/ta-15.jpg" | "/images/hero/ta-16.jpg" | "/images/hero/ta-17.jpg" | "/images/hero/ta-18.jpg" | "/images/hero/ta-19.jpg" | "/images/hero/ta-2.jpeg" | "/images/hero/ta-20.jpg" | "/images/hero/ta-21.jpg" | "/images/hero/ta-22.jpg" | "/images/hero/ta-3.jpeg" | "/images/hero/ta-4.jpeg" | "/images/hero/ta-5.jpeg" | "/images/hero/ta-6.jpeg" | "/images/hero/ta-7.jpeg" | "/images/hero/ta-8.jpeg" | "/images/hero/ta-9.jpg" | "/images/logo-1.webp" | "/images/logo.webp" | "/images/op.webp" | "/images/placeholder.jpeg" | "/images/placeholder.webp" | "/images/team/aisha-deborah-egena-aruwa.jpg" | "/images/team/angel-tomi-olorunmonu.jpg" | "/images/team/armstrong-ogundele.jpg" | "/images/team/azeema-aliu.jpg" | "/images/team/divine-micheal.jpg" | "/images/team/esther-ojoma-sule.jpg" | "/images/team/fagbemi-janet-okikiola.jpg" | "/images/team/ipinymi-korede-precious.jpg" | "/images/team/isaac-olorunmowaju.jpg" | "/images/team/kehinde-samuel-oluwagbemiga.jpg" | "/images/team/oluwagbemi-delight-adetunji.jpg" | "/images/team/victoria-ojima-abiodun.jpg" | "/images/uploads/1759693286674.jpeg" | "/images/uploads/1759698171564.jpeg" | "/images/uploads/1759735010088.jpeg" | "/images/uploads/1759735387474.jpg" | "/images/uploads/1759739637895.jpg" | "/images/uploads/1759741073911.jpg" | "/images/uploads/1759741159818.jpg" | "/images/uploads/1760644014540.jpg" | string & {};
	}
}