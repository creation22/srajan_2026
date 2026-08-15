import Link from "next/link";
import ThoughtsBackLink from "@/components/ThoughtsBackLink";

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
            <div className="grid gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4">
              <p className="text-[0.95rem] leading-none font-semibold text-white">01/</p>
              <div className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white">
                <Link
                  href="/reflection/life-logs"
                  className="underline decoration-white/35 underline-offset-4 transition hover:decoration-white"
                >
                  life logs
                </Link>{" "}
                <span className="text-white/72">thoughts, opinions, growth, and life</span>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4">
              <p className="text-[0.95rem] leading-none font-semibold text-white">02/</p>
              <div className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white">
                <Link
                  href="/reflection/technical"
                  className="underline decoration-white/35 underline-offset-4 transition hover:decoration-white"
                >
                  technical
                </Link>{" "}
                <span className="text-white/72">code, systems, ai, and how things work</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
