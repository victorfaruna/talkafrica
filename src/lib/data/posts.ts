export type Post = {
	id: string;
	title: string;
	description: string;
	image: string;
	category:
		| 'news'
		| 'sport'
		| 'business'
		| 'innovation'
		| 'culture'
		| 'arts'
		| 'travel'
		| 'audio'
		| 'video';
	slug: string;
	url: string;
};

export const posts: Post[] = [
	{
		id: '1',
		title: 'Elections 2025: Key Developments Across the Region',
		description:
			'A roundup of the most significant political updates shaping the continent ahead of the 2025 elections.',
		image: '/images/eee.webp',
		category: 'news',
		slug: 'elections-2025-key-developments',
		url: '/news/elections-2025-key-developments'
	},
	{
		id: '2',
		title: 'Startup Ecosystem Booms With New Funding',
		description: 'Venture funding sees a surge as local startups scale across borders.',
		image: '/images/op.webp',
		category: 'business',
		slug: 'startup-ecosystem-booms',
		url: '/business/startup-ecosystem-booms'
	},
	{
		id: '3',
		title: 'Breakthrough in Off-Grid Energy Innovation',
		description: 'Micro-grid solutions are lighting up rural communities with sustainable power.',
		image: '/images/hero/ta-3.jpeg',
		category: 'innovation',
		slug: 'off-grid-energy-innovation',
		url: '/innovation/off-grid-energy-innovation'
	},
	{
		id: '4',
		title: 'Cultural Festivals Return With Vibrant Showcases',
		description: 'Annual cultural events make a comeback, celebrating heritage and the arts.',
		image: '/images/hero/ta-6.jpeg',
		category: 'culture',
		slug: 'cultural-festivals-return',
		url: '/culture/cultural-festivals-return'
	},
	{
		id: '5',
		title: 'National Team Secures Historic Victory',
		description: 'A thrilling finish captivates fans as the national team makes history.',
		image: '/images/hero/ta-1.jpeg',
		category: 'sport',
		slug: 'national-team-historic-victory',
		url: '/sport/national-team-historic-victory'
	},
	{
		id: '6',
		title: 'Exploring Ancient Rock Art in the Sahara',
		description: 'Archaeologists uncover new clues to prehistoric life through stunning rock art.',
		image: '/images/hero/ta-8.jpeg',
		category: 'arts',
		slug: 'ancient-rock-art-sahara',
		url: '/arts/ancient-rock-art-sahara'
	},
	{
		id: '7',
		title: 'Top Coastal Destinations for 2025',
		description: 'From hidden gems to iconic beaches, here are the must-visit coastal escapes.',
		image: '/images/hero/ta-7.jpeg',
		category: 'travel',
		slug: 'top-coastal-destinations-2025',
		url: '/travel/top-coastal-destinations-2025'
	},
	{
		id: '8',
		title: 'Podcast: Voices of the Diaspora',
		description: 'A new series explores identity, culture, and innovation across the diaspora.',
		image: '/images/hero/ta-5.jpeg',
		category: 'audio',
		slug: 'podcast-voices-of-the-diaspora',
		url: '/audio/podcast-voices-of-the-diaspora'
	},
	{
		id: '9',
		title: 'Documentary: Rewilding the Savanna',
		description:
			'A breathtaking look at conservation efforts bringing wildlife back to their habitats.',
		image: '/images/hero/ta-2.jpeg',
		category: 'video',
		slug: 'documentary-rewilding-savanna',
		url: '/video/documentary-rewilding-savanna'
	}
];

export const categories = [
	'news',
	'sport',
	'business',
	'innovation',
	'culture',
	'arts',
	'travel',
	'audio',
	'video'
] as const;

export type Category = (typeof categories)[number];
