import ThoughtsBackLink from "@/components/ThoughtsBackLink";

export default function CV() {
  return (
    <main className="flex min-h-[calc(100dvh-5rem)] flex-col py-10 sm:py-14">
      <section className="w-full flex-1 flex flex-col">
        <div className="grid gap-8 sm:gap-10 flex-1">
          <ThoughtsBackLink label="srajan" />

          <div className="flex items-center justify-between max-w-4xl">
            <h1 className="text-[2rem] leading-none font-semibold text-white">
              cv
            </h1>
            <a
              href="/srajan-cv.pdf"
              download="srajan-cv.pdf"
              className="text-[0.95rem] font-semibold text-white underline decoration-white/35 underline-offset-4 transition hover:decoration-white"
            >
              download ↓
            </a>
          </div>

          <div className="w-full flex-1 min-h-[80vh]">
            <iframe
              src="/srajan-cv.pdf"
              className="w-full h-full min-h-[80vh] rounded-sm"
              style={{ border: "none" }}
              title="Srajan CV"
            />
          </div>

        </div>
      </section>
    </main>
  );
}
