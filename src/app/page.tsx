import Link from "next/link";
import { ArrowUpRight, Check, Play, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { courses } from "@/lib/data";

export default function Home() {
  return (
    <div className="marketing-page">
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy">
            <div className="kicker"><span /> HỌC ĐỂ LÀM ĐƯỢC</div>
            <h1>Biến kiến thức thành <em>hệ thống tạo kết quả.</em></h1>
            <p>Chương trình học thực chiến dành cho người muốn xây kinh doanh số bài bản—rõ hướng, chắc nền và tiến lên bằng dữ liệu.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/login">Bắt đầu học <ArrowUpRight /></Link>
              <Link className="button button-ghost" href={`/courses/${courses[0].slug}`}><Play /> Xem bài học mẫu</Link>
            </div>
            <div className="proof-row">
              <span><Check /> Lộ trình theo tuần</span>
              <span><Check /> Bài tập ứng dụng</span>
              <span><Check /> Theo dõi tiến độ</span>
            </div>
          </div>
          <div className="hero-console" aria-label="Minh họa lộ trình học">
            <div className="console-top"><span>LEARNING.OS</span><b>ONLINE</b></div>
            <div className="console-score"><small>TIẾN ĐỘ TUẦN</small><strong>72<sup>%</sup></strong></div>
            <div className="console-chart"><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="console-task">
              <span className="lesson-no">04</span>
              <div><small>ĐANG HỌC</small><b>Kiểm chứng trước khi xây</b></div>
              <Play />
            </div>
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          </div>
        </section>

        <section className="program-section" id="chuong-trinh">
          <div className="section-heading">
            <div><span className="section-index">01</span><p>CHƯƠNG TRÌNH</p></div>
            <h2>Một lộ trình. Ba năng lực lõi.</h2>
          </div>
          <div className="program-grid">
            {courses.map((course, index) => (
              <Link className="program-tile" href={`/courses/${course.slug}`} key={course.slug} style={{ "--course-accent": course.accent } as React.CSSProperties}>
                <div className="program-code">{course.code}<Sparkles /></div>
                <span>0{index + 1}</span>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <b>{course.lessons.length} bài học <ArrowUpRight /></b>
              </Link>
            ))}
          </div>
        </section>

        <section className="method-section" id="phuong-phap">
          <div className="method-statement">
            <span className="section-index">02</span>
            <h2>Không học để biết thêm.<br /><em>Học để thay đổi cách làm.</em></h2>
          </div>
          <div className="method-list">
            <article><b>01</b><div><h3>Ngắn, rõ, đúng trọng tâm</h3><p>Mỗi bài giải quyết một nút thắt cụ thể, kèm hành động có thể làm ngay.</p></div></article>
            <article><b>02</b><div><h3>Tiến độ nhìn thấy được</h3><p>Biết mình đang ở đâu, đã hoàn thành gì và bước tiếp theo là gì.</p></div></article>
            <article><b>03</b><div><h3>Hệ thống hóa kiến thức</h3><p>Từ bài học rời rạc thành quy trình có thể lặp lại trong công việc thật.</p></div></article>
          </div>
        </section>
      </main>
      <footer className="site-footer"><BrandFooter /><p>© 2026 KhươngNV Academy. Học thực chiến, tăng trưởng bền vững.</p></footer>
    </div>
  );
}

function BrandFooter() {
  return <strong>KHƯƠNGNV <em>ACADEMY</em></strong>;
}
