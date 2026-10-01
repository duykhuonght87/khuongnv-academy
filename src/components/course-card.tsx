import Link from "next/link";
import { Clock3 } from "lucide-react";
import type { Course } from "@/lib/data";

export function CourseCard({ course, progress = 0 }: { course: Course; progress?: number }) {
  const minutes = course.lessons.reduce((sum, lesson) => sum + Number.parseInt(lesson.duration), 0);
  return (
    <article className="course-card" style={{ "--course-accent": course.accent } as React.CSSProperties}>
      <div className="course-art" aria-hidden="true">
        <span>{course.code}</span>
        <strong>{course.title.split(" ").slice(0, 2).join(" ")}</strong>
        <i />
      </div>
      <div className="course-card-body">
        <div className="eyebrow-row"><span>{course.level}</span><span><Clock3 /> {minutes} phút</span></div>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="progress-meta"><span>Tiến độ</span><b>{progress}%</b></div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        <Link className="text-link" href={`/courses/${course.slug}`}>{progress ? "Tiếp tục học" : "Xem chương trình"}</Link>
      </div>
    </article>
  );
}
