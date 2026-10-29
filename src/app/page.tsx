import Link from "next/link";
import { Doo } from "@/components/brand/Doo";
import { SiteShell } from "@/components/brand/SiteShell";
import { Tex } from "@/components/math/RichText";
import { paths } from "@/content/courses";

const features = [
  {
    title: "Learn by doing",
    body: "No walls of text. Tip scales, drag steps and type answers, and you get feedback the moment you try.",
  },
  {
    title: "Every level",
    body: "From first fractions to calculus. Start where you are, and Doo will meet you there. Smugly.",
  },
  {
    title: "Bite-sized",
    body: "Lessons take about 10 minutes. Short enough for a bus ride, long enough to actually get it.",
  },
];

export default function Home() {
  return (
    <SiteShell>
      {/* hero */}
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 pb-16 pt-12 md:grid-cols-[1.2fr_1fr] md:pt-20">
        <div>
          <p className="hand text-xl text-red">Maths, for every level of genius</p>
          <h1 className="hand mt-2 text-5xl font-bold leading-[1.05] sm:text-6xl">
            Maths you can <span className="marker-underline">push</span>,{" "}
            <span className="marker-underline">tip</span> and <span className="marker-underline">solve</span>.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-muted">
            Chalkadoo turns maths into hands-on puzzles. Short, interactive lessons take you from fractions to
            calculus, with a know-it-all piece of chalk cheering you on.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/learn/algebra/balancing-equations" className="btn btn-primary text-lg">
              Try a free lesson →
            </Link>
            <Link href="/learn/algebra" className="btn btn-ghost text-lg">
              Browse courses
            </Link>
          </div>
        </div>

        {/* a whiteboard sketch */}
        <div className="panel relative mx-auto w-full max-w-sm rotate-[1.5deg] bg-surface px-6 pb-6 pt-8">
          <div className="hand space-y-1 text-2xl">
            <p className="text-blue">
              <Tex tex="3x + 2 = 14" />
            </p>
            <p className="text-red">
              <Tex tex="3x = 12" />
            </p>
            <p className="text-green">
              <Tex tex="x = 4" /> <span className="ml-1">✓</span>
            </p>
          </div>
          <p className="hand mt-4 pr-16 text-lg text-ink-muted">“Whatever you do to one side, do to the other.”</p>
          <div className="absolute -bottom-10 -right-6">
            <Doo mood="smug" size={110} title="Doo, the know-it-all chalk" />
          </div>
        </div>
      </section>

      {/* features */}
      <section className="mx-auto grid max-w-5xl gap-5 px-4 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="panel p-5">
            <h2 className="hand text-2xl font-bold">{f.title}</h2>
            <p className="mt-2 text-ink-muted">{f.body}</p>
          </div>
        ))}
      </section>

      {/* learning paths */}
      <section className="mx-auto max-w-5xl px-4 pt-20">
        <h2 className="hand text-4xl font-bold">
          <span className="marker-underline">Pick your path</span>
        </h2>
        <p className="mt-2 text-ink-muted">Maths first. Physics and computer science come later. Obviously.</p>
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((p) => {
            const inner = (
              <>
                <p className="text-sm font-bold text-ink-muted">{p.level}</p>
                <h3 className="hand mt-1 text-2xl font-bold">{p.name}</h3>
                <p className="mt-1 text-ink-muted">{p.blurb}</p>
                <p className={`mt-3 text-sm font-bold ${p.href ? "text-blue" : "text-ink-muted"}`}>
                  {p.href ? "Start now →" : "Coming soon"}
                </p>
              </>
            );
            return (
              <li key={p.name}>
                {p.href ? (
                  <Link href={p.href} className="panel block h-full p-5 transition-transform hover:-translate-y-0.5">
                    {inner}
                  </Link>
                ) : (
                  <div className="panel h-full p-5 opacity-70">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* pricing */}
      <section className="mx-auto max-w-5xl px-4 pt-20">
        <h2 className="hand text-4xl font-bold">
          <span className="marker-underline">Free to start</span>
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="panel p-6">
            <h3 className="comic text-3xl">Free</h3>
            <p className="hand text-xl">Nothing to pay, ever</p>
            <ul className="mt-4 space-y-2">
              <li>✓ The first chapter of every course</li>
              <li>✓ A daily puzzle</li>
              <li>✓ 3 hints a day</li>
            </ul>
          </div>
          <div className="panel bg-hint p-6">
            <h3 className="comic text-3xl">Premium</h3>
            <p className="hand text-xl">Every lesson, unlimited hints</p>
            <ul className="mt-4 space-y-2">
              <li>✓ Every course and every lesson</li>
              <li>✓ Unlimited practice and worked solutions</li>
              <li>✓ Certificates to prove you&apos;re a genius</li>
            </ul>
            <p className="mt-4 text-sm text-ink-muted">Subscriptions are coming soon.</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
