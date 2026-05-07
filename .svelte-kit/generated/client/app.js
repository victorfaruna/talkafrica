export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29')
];

export const server_loads = [2];

export const dictionary = {
		"/": [~3],
		"/about": [~4],
		"/admin": [~5,[2]],
		"/admin/categories": [6,[2]],
		"/admin/comments": [~7,[2]],
		"/admin/debug": [~8,[2]],
		"/admin/employee-of-the-month": [~9,[2]],
		"/admin/impact": [~10,[2]],
		"/admin/impact/new": [11,[2]],
		"/admin/login": [12,[2]],
		"/admin/movies": [~13,[2]],
		"/admin/movies/new": [14,[2]],
		"/admin/movies/[id]/edit": [~15,[2]],
		"/admin/posts/new": [16,[2]],
		"/admin/videos": [~17,[2]],
		"/admin/videos/new": [18,[2]],
		"/admin/videos/[id]/edit": [~19,[2]],
		"/african-giant": [~20],
		"/contact": [21],
		"/donate": [22],
		"/movies": [~23],
		"/movies/[slug]": [~24],
		"/posts/[post_id]": [~25],
		"/privacy": [26],
		"/terms": [27],
		"/videos": [~28],
		"/[category=category]": [~29]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';