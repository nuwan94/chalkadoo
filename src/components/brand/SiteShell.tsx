import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-20 border-b-[2.5px] border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          <Logo />
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link href="/learn/algebra" className="font-bold hover:underline underline-offset-4">
              Courses
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t-[2.5px] border-line mt-16">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-ink-muted flex flex-wrap justify-between gap-2">
          <span className="hand text-base">Chalkadoo — learn maths by doing.</span>
          <span>Doo says: show your working.</span>
        </div>
      </footer>
    </>
  );
}
