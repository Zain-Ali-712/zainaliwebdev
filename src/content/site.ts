export const site = {
  name: "Zain Ali",
  roles: ["Full Stack Developer", "UI/UX Designer"],
  city: "Lahore, Pakistan",
  timezone: "Asia/Karachi",
  email: "zainaliwebdev@gmail.com",
  url: "https://zainaliwebdev.vercel.app",
  // Resume_Zain_Ali.pdf was not found on disk; the CV button stays hidden until this is set.
  cvUrl: null as string | null,
  available: true,
  education: {
    degree: "BS Software Engineering",
    school: "COMSATS University Islamabad, Lahore Campus",
    session: "2023 – 2027",
    graduating: "Feb 2027",
  },
  socials: [
    { label: "LinkedIn", short: "in", href: "https://www.linkedin.com/in/zain-webdev-68ba04365" },
    { label: "GitHub", short: "gh", href: "https://github.com/Zain-Ali-712" },
    { label: "Instagram", short: "ig", href: "https://www.instagram.com/zaindev_design" },
    { label: "Threads", short: "th", href: "https://www.threads.net/@zaindev_design" },
  ],
  stats: [
    { value: 10, suffix: "+", label: "Projects shipped", note: "Client + concept" },
    { value: 3, suffix: "", label: "Countries", note: "New Zealand · Norway · Pakistan" },
    { value: 2024, suffix: "", label: "Building since", note: "Feb 2024" },
  ],
  builds: ["Websites", "Web apps", "Landing pages", "Dashboards", "Booking flows", "Real-time chat"],
  emailjs: {
    // Same EmailJS service the previous portfolio used (Zain-Ali/src/components/contact/ContactMe.jsx).
    serviceId: "service_q1ykbmr",
    templateId: "template_h7n409j",
    publicKey: "YSam38V3pjQZPvV_x",
  },
};

export const nav = [
  { id: "about", label: "About" },
  { id: "works", label: "Work" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

export const services = [
  {
    no: "01",
    title: "UI/UX & Web Design",
    tags: ["Wireframes", "Design systems", "Brand-true UI"],
    image: "/work/health-n-goodness/d-0.jpg",
  },
  {
    no: "02",
    title: "Web Development",
    tags: ["Next.js", "React", "Motion & GSAP"],
    image: "/work/four/d-0.jpg",
  },
  {
    no: "03",
    title: "Web Apps & Dashboards",
    tags: ["Full stack", "Auth & roles", "MongoDB · Supabase"],
    image: "/work/trackme/dashboard.jpg",
  },
  {
    no: "04",
    title: "Booking, Ordering & Real-time",
    tags: ["Carts & checkout", "Booking flows", "Socket.io chat"],
    image: "/work/tamp-and-tide/d-0.jpg",
  },
];

// From the "How I build a website" reel. DRAFT copy for each step.
export const process = [
  { no: "01", title: "Brief", text: "A short call. What the business sells, who buys it, and what the site has to do for them." },
  { no: "02", title: "Research", text: "I pull real menus, prices, branches and reviews from the brand's own channels. Nothing made up." },
  { no: "03", title: "Wireframe", text: "Page structure and content order first, so the design has a job to do." },
  { no: "04", title: "Design", text: "Your fonts, your colours, your photos. Premium and minimal, with small interactions." },
  { no: "05", title: "Build", text: "A working demo, not a picture: cart, checkout, bookings, maps, live open hours." },
  { no: "06", title: "Launch", text: "Deployed on Vercel from GitHub, fast on phones, set up for search." },
  { no: "07", title: "Support", text: "Changes, new pages and fixes after launch. The site keeps up with the business." },
];

// The intro reel lists 9; the ninth is still to confirm with Zain.
export const stack = [
  { name: "React", color: "#E8915A", ink: "#15171C", hex: "#E8915A", rgb: "232 145 90" },
  { name: "Next.js", color: "#15171C", ink: "#F3F2EF", hex: "#15171C", rgb: "21 23 28" },
  { name: "TypeScript", color: "#1F6FA8", ink: "#F3F2EF", hex: "#1F6FA8", rgb: "31 111 168" },
  { name: "Tailwind CSS", color: "#E9E4DF", ink: "#15171C", hex: "#E9E4DF", rgb: "233 228 223" },
  { name: "Node.js", color: "#E8915A", ink: "#15171C", hex: "#E8915A", rgb: "232 145 90" },
  { name: "Express", color: "#15171C", ink: "#F3F2EF", hex: "#15171C", rgb: "21 23 28" },
  { name: "MongoDB", color: "#1F6FA8", ink: "#F3F2EF", hex: "#1F6FA8", rgb: "31 111 168" },
  { name: "Supabase", color: "#E9E4DF", ink: "#15171C", hex: "#E9E4DF", rgb: "233 228 223" },
];

export const alsoUsed = [
  "GSAP", "Lenis", "Motion", "Three.js", "shadcn/ui", "Socket.io", "WebRTC", "Leaflet",
  "Cloudinary", "JWT", "Google OAuth", "Gemini API", "TanStack Query", "Vite", "Vercel", "Playwright",
];

// Dates traced to git history and FYP documents.
export const journey = [
  { year: "2023", title: "Started BS Software Engineering", where: "COMSATS University, Lahore", tag: "Education" },
  { year: "Feb 2024", title: "Started building for the web", where: "HTML, CSS, JavaScript, jQuery", tag: "Start" },
  { year: "2025", title: "First React projects, SyncWave and my first portfolio", where: "React · Socket.io · Three.js", tag: "Projects" },
  { year: "2025", title: "Client sites for New Zealand and Norway", where: "Kamilla Norman · Property Brokers", tag: "Client" },
  { year: "2026", title: "Leads Management System, a CRM for callers", where: "Team build · React · Node · MongoDB", tag: "Client" },
  { year: "2026", title: "SyncUP, my final year project, as group leader", where: "COMSATS Lahore", tag: "FYP" },
  { year: "Oct 2026", title: "Pitch series for Lahore restaurants and brands", where: "No Filter · FOUR · Health n Goodness · China Town", tag: "Pitch" },
  { year: "Feb 2027", title: "Graduating", where: "BS Software Engineering", tag: "Next" },
];

export const reels = [
  { title: "Hello, I'm Zain", src: "/reels/hello-zain.mp4", poster: "/reels/hello-zain.jpg" },
  { title: "How I build a website", src: "/reels/how-i-build.mp4", poster: "/reels/how-i-build.jpg" },
  { title: "5 things every business website needs", src: "/reels/website-tips.mp4", poster: "/reels/website-tips.jpg" },
];
