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
  role: "Software Engineer",
  tagline: "Building scalable systems & delightful interfaces since 2015",
  location: "Dubai, UAE · Open to remote",
  available: true,

  summary:
    "I specialize in enterprise grade systems, API solutions and many more. " + 
    "From Custom accounting & business Software, Mobile & Web Apps, to payment aggregators, " + 
    "From Planning to distribution. Maintanance, Database management & migrations.. " +
    "I care about clean architecture, developer experience, and the people who use products I build. " +
    "I work with clients who want real systems — not off-the-shelf templates.",

  whatIDo: [
    "🏗  Design & engineer end-to-end systems from architecture to deployment",
    "📱  Build mobile apps for iOS & Android",
    "🌐  Develop web platforms, portals & e-commerce stores",
    "🔌  Connect hardware through IoT & networking solutions",
    "📊  Build data pipelines, dashboards & real-time analytics",
    "🚀  Take products from idea to market — MVP to scale",
    "⚡  Diagnose & optimize slow, broken or legacy systems",
    "🔒  Implement secure backends, APIs & cloud infrastructure",
  ],

  services: [
    {
      name: "Online Shops / E-commerce",
      description:
        "I build fully custom online stores — product pages, shopping cart, " +
        "checkout, payment processing (Stripe, PayPal), order management, and admin dashboards. " +
        "Typical timeline: 4–8 weeks. Pricing starts around $3,000 for a basic shop.",
    },
    {
      name: "IoT & Networking",
      description:
        "I build connected systems that bridge hardware and software — sensor networks, " +
        "device dashboards, real-time data pipelines, and remote monitoring tools. " +
        "Whether it's a smart home setup or an industrial network, I handle the full stack " +
        "from device firmware integration to the cloud backend.",
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
        "Scope and price depend on complexity — happy to discuss.",
    },
    {
      name: "Fixes, Updates & Maintenance",
      description:
        "Existing site broken, slow, or outdated? I can fix bugs, update plugins, " +
        "improve speed, or add new features to an existing site. " +
        "Rates: $120/hour or a monthly retainer from $400/month.",
    },
  ],

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
         "Send me a message and I usually reply within a few hours.",
    },
    {
      q: "Do you work remotely?",
      a: "Yes, I work fully remote with clients worldwide. " +
         "I'm based in Dubai (GST timezone) but happy to schedule calls at your convenience.",
    },
  ],

  skills: {
    languages:  ["TypeScript", "JavaScript", "Python", "Go", "SQL"],
    mobile:     ["React Native"],
    frontend:   ["React", "Next.js", "Svelte", "Tailwind CSS", "WebGL"],
    backend:    ["Node.js", "Express", "FastAPI", "GraphQL", "REST"],
    databases:  ["PostgreSQL", "Redis", "MongoDB", "DynamoDB"],
    infra:      ["AWS", "GCP", "Docker", "Kubernetes", "Terraform", "CI/CD"],
    practices:  ["TDD", "Domain-Driven Design", "Event-Driven Architecture", "Agile"],
  },

  experience: [
    {
      company: "Uplifting Floral Studio",
      role:    "Senior Software Engineer",
      period:  "2021 – present",
      summary: "Led the redesign of the in-house CMS, reducing p99 latency by 38%. " +
               "Mentored 5 engineers and drove adoption of Go for critical path services.",
    },
    {
      company: "Emerald Financing Broker",
      role:    "Software Engineer",
      period:  "2019 – 2021",
      summary: "Built the operations engine powering core business workflows, " +
               "handling 2k+ records. Owned WebSocket infrastructure scaling from 50k to 1M concurrent connections.",
    },
    {
      company: "Freelance / Consulting",
      role:    "Full-Stack Engineer",
      period:  "2015 – 2019",
      summary: "Worked with 20+ clients across fintech, e-commerce, and SaaS. " +
               "Delivered end-to-end products from MVP to $10M ARR, " +
               "specialising in React frontends backed by Node microservices.",
    },
  ],

  projects: [
    {
      name:        "ugyard.com",
      description: "Multi-cloud environment management platform. " +
                   "Built with Nodejs, AWS SDK, GCP SDK, and Terraform.",
      tech:        ["Redis", "AWS SDK", "GCP SDK", "Terraform"],
      url:         "https://ugyard.com",
      status:      "active",
    },
    {
      name:        "floralshopuae.com",
      description: "E-commerce storefront for a UAE-based floral studio. " +
                   "Headless Wordpress, FastAPI backend, Stripe payments.",
      tech:        ["Next.js", "FastAPI", "PostgreSQL", "Stripe"],
      url:         "https://floralshopuae.com",
      status:      "live",
    },
    {
      name:        "Mosaic",
      description: "Real-time collaborative whiteboard with infinite canvas. " +
                   "Experiment in CRDTs and WebGL rendering.",
      tech:        ["TypeScript", "Yjs", "WebGL", "WebSockets"],
      url:         "https://github.com/octa230/mosaic",
      status:      "archived",
    },
  ],

  education: {
    degree: "B.S. Computer Science",
    school: "OutBox Edu, Lumumba Ave",
    year:   "2020",
  },

  contact: {
    email:    "mervynstunner@gmail.com",
    whatsapp: "971545574228",   // ← replace with your real UAE number, digits only
    github:   "github.com/octa230",
    twitter:  "@mervynstunner",
    linkedin: "linkedin.com/in/marvin-maloba-09b594232",
    website:  "mervynstunner.com",
  },
};

// Export for ES-module environments (frontend) and CommonJS (backend).
if (typeof module !== "undefined" && module.exports) {
  module.exports = portfolioData;
}