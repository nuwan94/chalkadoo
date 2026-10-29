/**
 * Course catalogue. Lesson bodies live next to this file as MDX:
 * src/content/<course>/<lesson>.mdx
 */
export type LessonMeta = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  /** 1 (gentle) to 5 (genius). */
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Free lessons are open to everyone; the rest will need a subscription. */
  free: boolean;
  /** False while the lesson is still being written. */
  available: boolean;
};

export type Course = {
  slug: string;
  title: string;
  tagline: string;
  path: string;
  level: string;
  lessons: LessonMeta[];
};

export const courses: Course[] = [
  {
    slug: "algebra",
    title: "Algebra: The Art of Balance",
    tagline: "Find the mystery number by keeping things level. Then find every mystery number, all at once.",
    path: "Algebra",
    level: "Ages 11+ · beginner",
    lessons: [
      {
        slug: "balancing-equations",
        title: "Balancing Equations",
        summary: "Equations are scales. Learn the one rule that solves them all.",
        minutes: 10,
        difficulty: 1,
        free: true,
        available: true,
      },
      {
        slug: "negative-numbers-on-the-scale",
        title: "Negative Numbers on the Scale",
        summary: "Balloons that pull upwards, and what happens when x is less than nothing.",
        minutes: 12,
        difficulty: 2,
        free: true,
        available: false,
      },
      {
        slug: "brackets",
        title: "Brackets Without Tears",
        summary: "Expand, factor, and stop being scared of 3(x + 2).",
        minutes: 12,
        difficulty: 2,
        free: false,
        available: false,
      },
      {
        slug: "inequalities",
        title: "Inequalities: Tipping on Purpose",
        summary: "When the scale is supposed to lean, and the one move that flips it.",
        minutes: 14,
        difficulty: 3,
        free: false,
        available: false,
      },
    ],
  },
];

/** Learning paths shown on the home page, from first steps to genius level. */
export const paths = [
  { name: "Number Sense", blurb: "Fractions, ratios and mental maths superpowers.", level: "Ages 8+", href: null },
  { name: "Algebra", blurb: "Mystery numbers, balance and the language of maths.", level: "Ages 11+", href: "/learn/algebra" },
  { name: "Geometry & Trig", blurb: "Shapes, angles and the triangle that measures the universe.", level: "Ages 12+", href: null },
  { name: "Probability & Stats", blurb: "Dice, data and why the house always wins.", level: "Ages 13+", href: null },
  { name: "Calculus", blurb: "The maths of change. Slopes, areas and infinity.", level: "Ages 16+", href: null },
  { name: "Advanced", blurb: "Linear algebra, number theory and proofs.", level: "University", href: null },
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function getLesson(courseSlug: string, lessonSlug: string) {
  const course = getCourse(courseSlug);
  const lesson = course?.lessons.find((l) => l.slug === lessonSlug);
  return course && lesson ? { course, lesson } : undefined;
}

/** The id a lesson's progress is stored under. */
export function lessonKey(course: string, lesson: string) {
  return `${course}/${lesson}`;
}
