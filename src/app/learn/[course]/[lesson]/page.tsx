import type { Metadata } from "next";
import { Children, isValidElement, Suspense, type ReactElement } from "react";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { courses, getLesson, lessonKey } from "@/content/courses";

export function generateStaticParams() {
  return courses.flatMap((c) =>
    c.lessons.filter((l) => l.available).map((l) => ({ course: c.slug, lesson: l.slug })),
  );
}

export async function generateMetadata({ params }: PageProps<"/learn/[course]/[lesson]">): Promise<Metadata> {
  const { course, lesson } = await params;
  const found = getLesson(course, lesson);
  return found ? { title: found.lesson.title, description: found.lesson.summary } : {};
}

type MDXContent = (props: Record<string, unknown>) => ReactElement<{ children?: React.ReactNode }>;

export default function LessonPage({ params }: PageProps<"/learn/[course]/[lesson]">) {
  return (
    <Suspense fallback={<p className="hand p-8 text-center text-2xl text-ink-muted">Wiping the whiteboard…</p>}>
      <Lesson params={params} />
    </Suspense>
  );
}

async function Lesson({ params }: { params: PageProps<"/learn/[course]/[lesson]">["params"] }) {
  const { course, lesson } = await params;
  const found = getLesson(course, lesson);
  if (!found?.lesson.available) notFound();

  const { default: Content }: { default: MDXContent } = await import(`@/content/${course}/${lesson}.mdx`);
  // Render the MDX here and split it into its top-level <Step>s, so the client player
  // can show them one at a time.
  const steps = Children.toArray(Content({}).props.children).filter(isValidElement);

  return (
    <LessonPlayer
      steps={steps}
      meta={{
        key: lessonKey(course, lesson),
        title: found.lesson.title,
        courseTitle: found.course.title,
        courseHref: `/learn/${course}`,
      }}
    />
  );
}
