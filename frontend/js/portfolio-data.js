/**
 * portfolio-data.js
 * ─────────────────
 * Single source of truth for all portfolio content.
 * Edit this file to personalise the site — nowhere else.
 *
 * Also sent to the backend AI so it can answer questions from
 * non-technical visitors (webshop owners, small businesses, etc.)
 */

const portfolioData = {
    name: "Mervyn Stunner",
    role: "Senior Full-Stack Engineer",
    tagline: "Building scalable systems & delightful interfaces since 2015",
    location: "Dubai, UAE · Open to remote",
    available: true,

    // Plain-English summary — shown in the intro and used by the AI
    summary:
        "I've delivered production grade software for 9+ years" +
        "I build systems for startups and mid-size companies. I care about clean architecture, " +
        "developer experience, and the humans who use the things I build." +
        "I work with clients who care about real systems not templates",

    // ── What I can build for you (plain English for non-technical visitors) ──
    services: [
        {
            name: "Online Shops / E-commerce",
            description:
                "I build fully custom online stores — product pages, shopping cart, " +
                "checkout, payment processing (Stripe, PayPal), order management, and admin dashboards. " +
                "Typical timeline: 4–8 weeks. Pricing starts around $3,000 for a basic shop.",
        },
        {
            name: "Business / Landing Websites",
            description:
                "Professional websites for small businesses — fast, mobile-friendly, " +
                "with contact forms, Google Maps, booking widgets, and SEO. " +
                "Typical timeline: 1–2 weeks. Pricing starts around $800.",
        },
        {
            name: "Mobile & Web Applications",
            description:
                "Custom mobile apps (iOS & Android) and web platforms — booking systems, " +
                "member portals, dashboards, internal tools. Built from scratch for any device. " +
                "Scope and price depend on complexity — happy to discuss."
        },
        {
            name: "Fixes, Updates & Maintenance",
            description:
                "Existing site broken, slow, or outdated? I can fix bugs, update plugins, " +
                "improve speed, or add new features to an existing site. " +
                "Rates: $120/hour or a monthly retainer from $400/month.",
        },
    ],

    // ── FAQ that the AI can draw on ───────────────────────────────────────────
    faq: [
        {
            q: "How much does a website cost?",
            a: "A simple business website starts around $800–1,500. An online shop starts around $3,000. " +
                "Custom web apps vary. I always provide a fixed-price quote upfront so there are no surprises.",
        },
        {
            q: "How long does it take to build a website?",
            a: "A landing page or small business site: 1–2 weeks. " +
                "An online shop: 4–8 weeks. A custom app: 6–16 weeks, depending on scope.",
        },
        {
            q: "Can you build a webshop?",
            a: "Yes — it's one of my most common projects. I build custom shops with " +
                "product listings, cart, checkout, and payment processing. " +
                "Starts around $3,000 and typically takes 4–8 weeks.",
        },
        {
            q: "Do you work with clients who aren't technical?",
            a: "Absolutely. Most of my clients are business owners, not developers. " +
                "I handle all the technical work and explain things in plain language.",
        },
        {
            q: "Are you available right now?",
            a: "Yes — I'm currently open to new projects. " +
                "Send me an email and I usually reply within a few hours.",
        },
        {
            q: "Do you work remotely?",
            a: "Yes, I work fully remote with clients worldwide. " +
                "I'm based in San Francisco (PT timezone) but happy to schedule calls at your convenience.",
        },
    ],

    // ── Technical skills (for developer visitors) ─────────────────────────────
    skills: {
        languages: ["TypeScript", "JavaScript", "Python", "Go", "SQL"],
        mobileApps:['React-native'],
        frontend: ["React", "Next.js", "Svelte", "Tailwind CSS", "WebGL"],
        backend: ["Node.js", "Express", "FastAPI", "GraphQL", "REST"],
        databases: ["PostgreSQL", "Redis", "MongoDB", "DynamoDB"],
        infra: ["AWS", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD"],
        practices: ["TDD", "Domain-Driven Design", "Event-Driven Architecture", "Agile"],
    },

    experience: [
        {
            company: "Stripe",
            role: "Senior Software Engineer — Payments Infrastructure",
            period: "2021 – present",
            summary: "Led the redesign of the idempotency layer handling 4B+ daily transactions. " +
                "Reduced p99 latency by 38 %. Mentored 5 engineers. Drove adoption of Go " +
                "for critical path services.",
        },
        {
            company: "Notion",
            role: "Software Engineer — Real-time Collaboration",
            period: "2019 – 2021",
            summary: "Built the operational-transform engine powering live collaborative editing. " +
                "Shipped block-level commenting (used by 2M+ workspaces). Owned websocket " +
                "infrastructure scaling from 50k to 1M concurrent connections.",
        },
        {
            company: "Freelance / Consulting",
            role: "Full-Stack Engineer",
            period: "2015 – 2019",
            summary: "Worked with 20+ clients across fintech, e-commerce, and SaaS. " +
                "Delivered end-to-end products from MVP to $10M ARR. " +
                "Specialised in React frontends backed by Node microservices.",
        },
    ],

    projects: [
        {
            name: "Helix",
            description: "Open-source developer CLI for managing multi-cloud environments. " +
                "3.2k GitHub stars. Built with Go + Cobra.",
            tech: ["Go", "AWS SDK", "GCP SDK", "Terraform"],
            url: "https://github.com/alexrivera/helix",
            status: "active",
        },
        {
            name: "Inkwell",
            description: "AI-powered writing assistant SaaS. 8k MAU. " +
                "Next.js frontend, FastAPI backend, GPT-4 streaming.",
            tech: ["Next.js", "FastAPI", "PostgreSQL", "OpenAI", "Stripe"],
            url: "https://inkwell.dev",
            status: "live",
        },
        {
            name: "Mosaic",
            description: "Real-time collaborative whiteboard with infinite canvas. " +
                "Experiment in CRDTs and WebGL rendering.",
            tech: ["TypeScript", "Yjs", "WebGL", "WebSockets"],
            url: "https://github.com/alexrivera/mosaic",
            status: "archived",
        },
    ],

    education: {
        degree: "B.S. Computer Science",
        school: "OutBox Edu Lumumba Ave",
        year: "2020",
    },

    contact: {
        email: "alex@alexrivera.dev",
        github: "github.com/alexrivera",
        twitter: "@alexrivera_dev",
        linkedin: "linkedin.com/in/alexrivera-eng",
        website: "alexrivera.dev",
    },
};

// Export for ES-module environments (frontend) and CommonJS (backend).
if (typeof module !== "undefined" && module.exports) {
    module.exports = portfolioData;
}