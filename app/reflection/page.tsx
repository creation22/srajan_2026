import Link from "next/link";
import ThoughtsBackLink from "@/components/ThoughtsBackLink";

const sections = [
  {
    title: "personal",
    href: "/reflection/book",
    note: "learnings, a book written one chapter at a time",
  },
  {
    title: "blogs",
    href: "/reflection/blogs",
    note: "code, systems, ai, and marketing",
  },
];

export default function ReflectionPage() {
  return (
    <main className="flex min-h-[calc(100dvh-5rem)] items-center py-10 sm:py-14">
      <section className="w-full">
        <div className="grid gap-10 sm:gap-12">
          <ThoughtsBackLink label="srajan" />

          <div className="grid gap-3">
            <h1 className="text-[2rem] leading-none font-semibold text-white">
              writing
            </h1>
            <p className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white/72">
              things i think about and things i build
            </p>
          </div>

          <div className="grid gap-5 sm:gap-6">
            {sections.map((section, index) => (
              <div
                key={section.href}
                className="grid gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4"
              >
                <p className="text-[0.95rem] leading-none font-semibold text-white">
                  {String(index + 1).padStart(2, "0")}/
                </p>
                <div className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white">
                  <Link
                    href={section.href}
                    className="underline decoration-white/35 underline-offset-4 transition hover:decoration-white"
                  >
                    {section.title}
                  </Link>{" "}
                  <span className="text-white/72">{section.note}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}
