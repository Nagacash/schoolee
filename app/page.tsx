"use client";

import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useSpring,
  animate,
} from "framer-motion";
import { useRef, useEffect, useState, type MouseEvent } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  BarChart3,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Zap,
  Star,
  Users,
  Clock,
  GraduationCap,
  Quote,
  BookMarked,
} from "lucide-react";

/* ─── Animation Variants ─── */

const smoothEase = [0.25, 0.4, 0.25, 1] as const;

const heroContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.25, ease: smoothEase },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: smoothEase },
  },
};

const wordReveal = {
  hidden: { opacity: 0, y: 20, rotateX: 30 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.6, ease: smoothEase },
  },
};

const cardStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: smoothEase },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: smoothEase },
  },
};

/* ─── Counter Component ─── */

function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(motionVal, target, {
        duration,
        ease: smoothEase as unknown as [number, number, number, number],
      });
      return controls.stop;
    }
  }, [inView, motionVal, target, duration]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return unsub;
  }, [rounded]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString("de-DE")}
      {suffix}
    </span>
  );
}

/* ─── Data ─── */

const featuresLehrer = [
  {
    title: "Lesson Planner",
    description:
      "Thema, Klasse, Fach & Zeit – die KI zaubert deinen kompletten Stundenplan mit Phasen, Materialien und Hausaufgaben. In Sekunden statt Stunden.",
    href: "/lesson-planner",
    icon: BookOpen,
    colorClass: "text-primary",
    bgClass: "bg-primary/15",
    borderHover: "hover:border-primary/40",
    glowClass: "hover:shadow-[0_8px_40px_-8px_oklch(0.5_0.14_230/0.3)]",
    glowColor: "oklch(0.5 0.14 230 / 0.12)",
    gridClass: "md:col-span-1 md:row-span-2",
    large: true,
    tags: ["KI-generiert", "Export-ready"],
  },
  {
    title: "Insights",
    description:
      "CSV hochladen → KI analysiert: Schwächen erkennen, Empfehlungen erhalten und coole Charts generieren.",
    href: "/insights",
    icon: BarChart3,
    colorClass: "text-chart-2",
    bgClass: "bg-chart-2/15",
    borderHover: "hover:border-chart-2/40",
    glowClass: "hover:shadow-[0_8px_40px_-8px_oklch(0.55_0.14_165/0.3)]",
    glowColor: "oklch(0.55 0.14 165 / 0.12)",
    gridClass: "md:col-span-1",
    large: false,
    tags: ["Echtzeit", "CSV-Import"],
  },
  {
    title: "Magic Chat",
    description:
      "Quiz, Ideen, Lösungen – chatte mit der KI wie mit einem Freund. Immer bereit zu helfen.",
    href: "/magic-chat",
    icon: MessageSquare,
    colorClass: "text-chart-3",
    bgClass: "bg-chart-3/15",
    borderHover: "hover:border-chart-3/40",
    glowClass: "hover:shadow-[0_8px_40px_-8px_oklch(0.65_0.16_45/0.3)]",
    glowColor: "oklch(0.65 0.16 45 / 0.12)",
    gridClass: "md:col-span-1",
    large: false,
    tags: ["24/7", "Multilingual"],
  },
];

const featuresSchüler = [
  {
    title: "Lernen",
    description:
      "Deine Themen von der Lehrerin oder dem Lehrer – oder eigene Themen. Starte den Chat und lern mit der KI.",
    href: "/lernen",
    icon: BookMarked,
    colorClass: "text-primary",
    bgClass: "bg-primary/15",
    borderHover: "hover:border-primary/40",
    glowClass: "hover:shadow-[0_8px_40px_-8px_oklch(0.5_0.14_230/0.3)]",
    glowColor: "oklch(0.5 0.14 230 / 0.12)",
    gridClass: "md:col-span-1 md:row-span-2",
    large: true,
    tags: ["Themen", "Link teilen"],
  },
  {
    title: "Magic Chat",
    description:
      "Quiz, Ideen, Lösungen – chatte mit der KI wie mit einem Freund. Immer bereit zu helfen.",
    href: "/magic-chat",
    icon: MessageSquare,
    colorClass: "text-chart-3",
    bgClass: "bg-chart-3/15",
    borderHover: "hover:border-chart-3/40",
    glowClass: "hover:shadow-[0_8px_40px_-8px_oklch(0.65_0.16_45/0.3)]",
    glowColor: "oklch(0.65 0.16 45 / 0.12)",
    gridClass: "md:col-span-1",
    large: false,
    tags: ["24/7", "Multilingual"],
  },
];

const stats = [
  { value: 500, suffix: "+", label: "Lehrer", icon: Users },
  { value: 10000, suffix: "+", label: "Stunden geplant", icon: Clock },
  { value: 4.9, suffix: "★", label: "Bewertung", icon: Star },
  { value: 0, suffix: "", label: "KI-powered", icon: Zap, isLabel: true },
];

const steps = [
  {
    num: "1",
    title: "Thema wählen",
    description: "Wähle dein Fach, Klasse und Thema – oder lass die KI Vorschläge machen.",
  },
  {
    num: "2",
    title: "KI generiert",
    description: "Unsere KI erstellt in Sekunden einen kompletten, durchdachten Plan für dich.",
  },
  {
    num: "3",
    title: "Fertig!",
    description: "Dein fertiger Plan – anpassen, exportieren und direkt im Unterricht nutzen.",
  },
];

const trustedBy = [
  "Gymnasium München",
  "TU Berlin",
  "Uni Heidelberg",
  "HTL Wien",
  "Schule Zürich",
];

const testimonials = [
  {
    name: "Anna M.",
    role: "Lehrerin, Gymnasium München",
    initials: "AM",
    quote:
      "Naga Codex hat meine Unterrichtsvorbereitung von 3 Stunden auf 20 Minuten reduziert. Absolut unverzichtbar.",
  },
  {
    name: "Dr. Thomas K.",
    role: "Schulleiter, Berlin",
    initials: "TK",
    quote:
      "Die Insights-Funktion zeigt uns Schwächen sofort. Unsere Schüler haben sich um eine halbe Note verbessert.",
  },
  {
    name: "Sophie L.",
    role: "Studentin, TU Wien",
    initials: "SL",
    quote:
      "Magic Chat ist wie ein privater Tutor, der immer Zeit hat. Meine Prüfungsergebnisse sind deutlich besser geworden.",
  },
];

/* ─── Page Component ─── */

export default function Home() {
  const { user } = useAuth();
  const isSchüler = user?.role === "schüler";
  const features = isSchüler ? featuresSchüler : featuresLehrer;
  /* Refs for scroll-triggered sections */
  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.15 });

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  const testimonialsRef = useRef<HTMLDivElement>(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.15 });

  const stepsRef = useRef<HTMLDivElement>(null);
  const stepsInView = useInView(stepsRef, { once: true, amount: 0.2 });

  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  /* Mouse-tracking spotlight for hero */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  function handleHeroMouse(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ═══════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        onMouseMove={handleHeroMouse}
      >
        {/* Animated gradient mesh background */}
        <div
          className="pointer-events-none absolute inset-0 -z-20"
          aria-hidden="true"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 80% 60% at 20% 30%, oklch(0.6 0.12 230 / 0.18) 0%, transparent 60%),
              radial-gradient(ellipse 70% 50% at 80% 20%, oklch(0.6 0.1 165 / 0.15) 0%, transparent 55%),
              radial-gradient(ellipse 60% 40% at 50% 80%, oklch(0.65 0.08 45 / 0.12) 0%, transparent 50%),
              radial-gradient(ellipse 90% 70% at 60% 50%, oklch(0.55 0.06 280 / 0.08) 0%, transparent 60%)
            `,
            animation: "gradient-shift 15s ease-in-out infinite",
          }}
        />

        {/* Mouse-follow spotlight */}
        <motion.div
          className="pointer-events-none absolute -z-10 h-[500px] w-[500px] rounded-full opacity-40"
          aria-hidden="true"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
            background:
              "radial-gradient(circle, oklch(0.6 0.12 230 / 0.15) 0%, transparent 70%)",
          }}
        />

        {/* Floating glassmorphic orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div
            className="absolute top-[12%] left-[8%] h-32 w-32 rounded-full bg-primary/8 backdrop-blur-xl border border-white/10 dark:border-white/5"
            style={{ animation: "float-glass 22s ease-in-out infinite" }}
          />
          <div
            className="absolute top-[20%] right-[12%] h-20 w-20 rounded-2xl bg-chart-2/10 backdrop-blur-lg border border-white/8 dark:border-white/4"
            style={{ animation: "float-glass 18s ease-in-out infinite 3s" }}
          />
          <div
            className="absolute bottom-[25%] left-[15%] h-24 w-24 rounded-full bg-chart-3/8 backdrop-blur-xl border border-white/10 dark:border-white/5"
            style={{ animation: "float-glass 25s ease-in-out infinite 6s" }}
          />
          <div
            className="absolute top-[55%] right-[20%] h-16 w-16 rounded-xl bg-primary/6 backdrop-blur-lg border border-white/8 dark:border-white/4"
            style={{ animation: "float-glass 20s ease-in-out infinite 9s" }}
          />
          <div
            className="absolute bottom-[15%] right-[30%] h-28 w-28 rounded-full bg-chart-4/6 backdrop-blur-xl border border-white/10 dark:border-white/5"
            style={{ animation: "float-glass 24s ease-in-out infinite 12s" }}
          />
        </div>

        {/* Hero content */}
        <motion.div
          className="relative container mx-auto max-w-5xl text-center px-4"
          variants={heroContainer}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <motion.div variants={heroItem} className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-card/60 backdrop-blur-xl text-primary px-5 py-2.5 text-sm font-semibold border border-white/15 dark:border-white/10 shadow-lg">
              <Sparkles className="h-4 w-4" />
              Für Lehrer & Schüler
            </span>
          </motion.div>

          {/* Headline – word-by-word stagger */}
          <motion.h1
            className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-[0.95]"
            style={{ perspective: "800px" }}
          >
            <motion.span className="inline-flex gap-[0.3em] justify-center flex-wrap">
              {["Deine", "coole"].map((word, i) => (
                <motion.span
                  key={word}
                  variants={wordReveal}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: 0.4 + i * 0.12 }}
                  className="inline-block"
                  style={{ transformOrigin: "center bottom" }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.span>
            <motion.span
              className="block mt-2 bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1, delay: 0.7, ease: smoothEase as unknown as [number, number, number, number] }}
              style={{
                textShadow: "0 0 60px oklch(0.5 0.14 230 / 0.25)",
              }}
            >
              Schul-App
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={heroItem}
            className="mt-8 text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Stunden planen, Noten verstehen, Magic Chat –{" "}
            <span className="text-foreground">mit KI macht Schule Spaß.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={heroItem}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href={isSchüler ? "/lernen" : "/lesson-planner"}>
              <motion.span
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_-5px_oklch(0.5_0.14_230/0.5)]"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                style={{ animation: "glow-pulse 3s ease-in-out infinite" }}
              >
                {isSchüler ? "Zum Lernen" : "Jetzt Starten"}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.span>
            </Link>
            <a href="#features">
              <motion.span
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-transparent text-foreground px-8 py-4 text-base font-semibold border border-border hover:border-primary/40 transition-all duration-300 hover:bg-primary/5"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Mehr erfahren
              </motion.span>
            </a>
          </motion.div>

          {/* Trusted-by strip */}
          <motion.div
            variants={heroItem}
            className="mt-16 flex flex-col items-center gap-4"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
              Vertraut von
            </span>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              {trustedBy.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground/40 select-none"
                >
                  <GraduationCap className="h-4 w-4" />
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <a
            href="#features"
            className="flex flex-col items-center gap-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer"
          >
            <span className="text-xs font-medium tracking-widest uppercase">Entdecken</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </a>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — FEATURE BENTO GRID
          ═══════════════════════════════════════════ */}
      <section id="features" className="container py-24 md:py-32">
        <motion.div
          ref={featuresRef}
          className="mx-auto max-w-6xl"
          variants={cardStagger}
          initial="hidden"
          animate={featuresInView ? "show" : "hidden"}
        >
          {/* Section header */}
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Alles, was du brauchst
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Drei mächtige Werkzeuge, die deinen Schulalltag revolutionieren.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid gap-6 md:grid-cols-2 md:grid-rows-2">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={cardItem}
                className={feature.gridClass}
              >
                <Link href={feature.href} className="block group h-full">
                  <motion.div
                    className="h-full"
                    whileHover={{
                      y: -8,
                      transition: {
                        duration: 0.3,
                        ease: smoothEase as unknown as [number, number, number, number],
                      },
                    }}
                  >
                    <Card
                      className={`relative h-full transition-all duration-500 cursor-pointer rounded-3xl overflow-hidden border border-white/10 dark:border-white/5 bg-card/80 backdrop-blur-xl ${feature.borderHover} ${feature.glowClass} p-0`}
                    >
                      {/* Inner glow on hover */}
                      <div
                        className="pointer-events-none absolute top-0 left-0 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl -z-0"
                        style={{ background: `radial-gradient(circle, ${feature.glowColor}, transparent 70%)` }}
                      />

                      <div
                        className={`relative z-10 flex ${feature.large ? "flex-col justify-between h-full" : "flex-col"} p-8`}
                      >
                        {/* Icon with rotate on hover */}
                        <motion.div
                          className={`w-14 h-14 rounded-2xl ${feature.bgClass} flex items-center justify-center mb-6 transition-transform duration-500`}
                          whileHover={{ rotate: 360, scale: 1.15 }}
                          transition={{ duration: 0.6, ease: smoothEase as unknown as [number, number, number, number] }}
                        >
                          <feature.icon className={`h-7 w-7 ${feature.colorClass}`} />
                        </motion.div>

                        <div className={feature.large ? "mt-auto" : ""}>
                          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 flex items-center gap-3">
                            {feature.title}
                            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                          </h3>
                          <p className="text-muted-foreground leading-relaxed text-base mb-4">
                            {feature.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            {feature.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${feature.bgClass} ${feature.colorClass} border border-current/10`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 — STATS / SOCIAL PROOF
          ═══════════════════════════════════════════ */}
      <section ref={statsRef} className="container py-12 md:py-16">
        <motion.div
          className="mx-auto max-w-5xl rounded-3xl bg-card/60 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: smoothEase as unknown as [number, number, number, number] }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center justify-center py-8 px-4 ${
                  i < stats.length - 1 ? "border-r border-white/5" : ""
                } ${i < 2 ? "border-b md:border-b-0 border-white/5" : ""}`}
              >
                <stat.icon className="h-5 w-5 text-primary mb-3 opacity-60" />
                <div className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                  {stat.isLabel ? (
                    <Zap className="h-8 w-8 text-primary" />
                  ) : (
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      duration={stat.value > 1000 ? 2.5 : 1.5}
                    />
                  )}
                </div>
                <div className="mt-2 text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4 — TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section className="container py-24 md:py-32">
        <motion.div
          ref={testimonialsRef}
          className="mx-auto max-w-6xl"
          variants={cardStagger}
          initial="hidden"
          animate={testimonialsInView ? "show" : "hidden"}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Was andere sagen
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Tausende Lehrer und Schüler vertrauen bereits auf Naga Codex.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={cardItem}>
                <Card className="relative h-full rounded-3xl overflow-hidden border border-white/10 dark:border-white/5 bg-card/70 backdrop-blur-xl p-8 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 cursor-default">
                  {/* Decorative quote */}
                  <Quote className="absolute top-6 right-6 h-10 w-10 text-primary/10" />

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-chart-3 text-chart-3"
                      />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="text-foreground leading-relaxed text-base mb-6 relative z-10">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5 — HOW IT WORKS (3 Steps)
          ═══════════════════════════════════════════ */}
      <section className="container py-24 md:py-32">
        <motion.div
          ref={stepsRef}
          className="mx-auto max-w-5xl"
          initial="hidden"
          animate={stepsInView ? "show" : "hidden"}
          variants={cardStagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              So einfach geht&apos;s
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              In drei Schritten zur perfekten Unterrichtsplanung.
            </p>
          </motion.div>

          <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
            {/* Connecting line (desktop) */}
            <div
              className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px border-t-2 border-dashed border-primary/20"
              aria-hidden="true"
            />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                variants={cardItem}
                className="relative flex flex-col items-center text-center"
              >
                {/* Number circle */}
                <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-card/80 backdrop-blur-xl border-2 border-primary/20 shadow-lg mb-8">
                  <span className="text-2xl font-extrabold text-primary">{step.num}</span>
                  <div className="absolute inset-0 rounded-full bg-primary/5 animate-ping opacity-20" />
                </div>

                {/* Connecting line (mobile) */}
                {i < steps.length - 1 && (
                  <div
                    className="md:hidden absolute top-20 left-1/2 -translate-x-1/2 h-12 w-px border-l-2 border-dashed border-primary/20"
                    aria-hidden="true"
                  />
                )}

                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 6 — BOTTOM CTA
          ═══════════════════════════════════════════ */}
      <section className="container py-24 md:py-32">
        <motion.div
          ref={ctaRef}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-card/60 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: smoothEase as unknown as [number, number, number, number] }}
        >
          {/* Noise grain overlay */}
          <div className="pointer-events-none absolute inset-0 noise-overlay opacity-50 z-0" aria-hidden="true" />

          {/* Dot pattern */}
          <div className="pointer-events-none absolute inset-0 dot-pattern opacity-30 z-0" aria-hidden="true" />

          {/* Background blurred orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div
              className="absolute -top-8 -left-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
              style={{ animation: "float-glass 18s ease-in-out infinite" }}
            />
            <div
              className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-chart-2/10 blur-3xl"
              style={{ animation: "float-glass 22s ease-in-out infinite 5s" }}
            />
          </div>

          {/* Floating particle dots */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {[
              { top: "20%", left: "10%", delay: "0s", dur: "14s" },
              { top: "60%", left: "85%", delay: "3s", dur: "18s" },
              { top: "80%", left: "30%", delay: "6s", dur: "16s" },
              { top: "15%", left: "70%", delay: "9s", dur: "20s" },
              { top: "50%", left: "50%", delay: "2s", dur: "15s" },
            ].map((p, i) => (
              <div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-primary/40"
                style={{
                  top: p.top,
                  left: p.left,
                  animation: `particle-drift ${p.dur} ease-in-out infinite ${p.delay}`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Bereit loszulegen?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
              Starte jetzt kostenlos und erlebe, wie KI deinen Schulalltag verändert.
            </p>
            <div className="mt-10">
              <Link href={isSchüler ? "/lernen" : "/lesson-planner"}>
                <motion.span
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary text-primary-foreground px-10 py-5 text-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-[0_0_40px_-5px_oklch(0.5_0.14_230/0.5)]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ animation: "glow-pulse 3s ease-in-out infinite" }}
                >
                  {isSchüler ? "Zum Lernen" : "Starte jetzt kostenlos"}
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="h-16" />
    </div>
  );
}
