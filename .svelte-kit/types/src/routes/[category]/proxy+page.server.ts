// @ts-nocheck
import type { PageServerLoad } from './$types';
import { categories, posts } from '$lib/data/posts';

export const load = ({ params }: Parameters<PageServerLoad>[0]) => {
	const categoryParam = params.category?.toLowerCase();

	if (!categoryParam || !categories.includes(categoryParam as any)) {
		return {
			category: categoryParam ?? '',
			posts: [],
			notFound: true
		};
	}

	const filtered = posts.filter((p) => p.category === categoryParam);

	return {
		category: categoryParam,
		posts: filtered,
		notFound: filtered.length === 0
	};
};
