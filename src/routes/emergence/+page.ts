import type { PageLoad } from "./$types";

export const load: PageLoad = ({ data }) => {
    return {
        ...data,
        title: "Emergence 2026 — The TalkAfrica NG Hangout",
        description:
            "Where young African creatives meet, connect, and build what comes next. Discover the conversations, community, and moments that make Emergence.",
        image: "/media/emergence/emergence-share.jpg",
        imageWidth: 2344,
        imageHeight: 1524,
        imageAlt: "TalkAfrica NG Emergence 2026 — The TalkAfrica NG Hangout",
    };
};
