import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Doo } from "@/components/brand/Doo";
import { SiteShell } from "@/components/brand/SiteShell";
import { LessonStatus, TotalXp } from "@/components/lesson/LessonStatus";
import { courses, getCourse, lessonKey } from "@/content/courses";

export function generateStaticParams() {
  return courses.map((c) => ({ course: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[course]">): Promise<Metadata> {
  const course = getCourse((await params).course);
  return course ? { title: course.title, description: course.tagline } : {};
}

function Difficulty({ level }: { level: number }) {
  return (
    <span aria-label={`Difficulty ${level} of 5`} className="tracking-tight text-blue">
      {"★".repeat(level)}
      <span className="text-ink-muted opacity-40">{"★".repeat(5 - level)}</span>
    </span>
  );
}

export default function CoursePage({ params }: PageProps<"/learn/[course]">) {
  return (
    <SiteShell>
      <Suspense fallback={<p className="hand p-8 text-center text-2xl text-ink-muted">Finding the chalk…</p>}>
        <CourseOutline params={params} />
      </Suspense>
    </SiteShell>
  );
}

async function CourseOutline({ params }: { params: PageProps<"/learn/[course]">["params"] }) {
  const course = getCourse((await params).course);
  if (!course) notFound();

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="hand text-lg text-ink-muted">{course.path} · {course.level}</p>
        <h1 className="hand mt-1 text-4xl font-bold leading-tight sm:text-5xl">
          <span className="marker-underline">{course.title}</span>
        </h1>
        <p className="mt-3 text-lg">{course.tagline}</p>
        <div className="mt-3">
          <TotalXp />
        </div>

        <ol className="mt-10 grid gap-5">
          {course.lessons.map((lesson, i) => {
            const href = `/learn/${course.slug}/${lesson.slug}`;
            const body = (
              <>
                <div className="flex items-start gap-4">
                  <span className="comic grid size-12 shrink-0 place-items-center rounded-full border-[2.5px] border-line bg-highlight text-2xl text-on-highlight">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h2 className="hand text-2xl font-bold leading-tight">{lesson.title}</h2>
                      <LessonStatus lessonKey={lessonKey(course.slug, lesson.slug)} />
                    </div>
                    <p className="mt-1 text-ink-muted">{lesson.summary}</p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 text-sm font-bold">
                      <Difficulty level={lesson.difficulty} />
                      <span>{lesson.minutes} min</span>
                      {lesson.free ? (
                        <span className="text-green">Free</span>
                      ) : (
                        <span className="text-purple">Premium</span>
                      )}
                      {!lesson.available && <span className="text-ink-muted">Being written on the whiteboard…</span>}
                    </p>
                  </div>
                </div>
              </>
            );
            return (
              <li key={lesson.slug}>
                {lesson.available ? (
                  <Link
                    href={href}
                    className="panel block p-5 transition-transform hover:-translate-y-0.5 hover:-rotate-[0.3deg]"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="panel p-5 opacity-60">{body}</div>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-12 flex items-end gap-3">
          <Doo mood="thinking" size={70} />
          <p className="panel bg-hint px-4 py-3">More lessons are on the way. Doo is checking every one for errors. Twice.</p>
        </div>
      </div>
    </>
  );
}
