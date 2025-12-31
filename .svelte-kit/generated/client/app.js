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
	() => import('./nodes/16')
];

export const server_loads = [2];

export const dictionary = {
		"/": [~3],
		"/about": [4],
		"/admin": [~5,[2]],
		"/admin/categories": [6,[2]],
		"/admin/login": [7,[2]],
		"/admin/posts/new": [8,[2]],
		"/admin/videos": [~9,[2]],
		"/admin/videos/new": [10,[2]],
		"/admin/videos/[id]/edit": [~11,[2]],
		"/african-giant": [~12],
		"/donate": [13],
		"/posts/[post_id]": [~14],
		"/videos": [~15],
		"/[category]": [~16]
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