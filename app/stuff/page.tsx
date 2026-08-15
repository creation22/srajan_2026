import ThoughtsBackLink from "@/components/ThoughtsBackLink";

const workProjects = [
  {
    name: "dailygeeta.com",
    link: "https://dailygeeta.com",
    description:
      "saas (acquired) — receive one email daily with shloks + hindi audio explanation powered by sarvam ai",
  },
  {
    name: "riddlebox",
    link: "https://riddlebox.heysrajan.com",
    description:
      "multiplayer riddle game — answer cs riddles with friends in real time",
  },
  {
    name: "altmangpt",
    link: "https://atlmangpt.heysrajan.com",
    description:
      "answer your startup problems through sam altman blogs — rag based vector embeddings",
  },
];

const funProjects = [
  {
    name: "marveltimeline.space",
    link: "https://marveltimeline.space",
    description:
      "in-order timeline to watch the entire marvel universe — built for beginners",
  },
  {
    name: "checkhiscount.space",
    link: "https://checkhiscount.space",
    description:
      "check body count of your boyfriend by inserting his instagram id",
  },
  {
    name: "talksense",
    link: "https://talksense.heysrajan.com",
    description:
      "export your whatsapp chat to understand how you are actually communicating",
  },
  {
    name: "rupeerush",
    link: "https://rupeerush.srajan.online",
    description:
      "hill climb racing game on the terrain of dollar vs rupee",
  },
  {
    name: "bemyvalentine.fun",
    link: "https://bemyvalentine.fun",
    description: "ask out your crush — the smoothest way possible",
  },
];

export default function Stuff() {
  return (
    <main className="flex min-h-[calc(100dvh-5rem)] items-center py-10 sm:py-14">
      <section className="w-full">
        <div className="grid gap-14 sm:gap-16">
          <ThoughtsBackLink label="srajan" />

          {/* Work */}
          <div className="grid gap-8 sm:gap-10">
            <div className="grid gap-3">
              <h1 className="text-[2rem] leading-none font-semibold text-white">
                work
              </h1>
              <p className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white/72">
                things i built that actually do something
              </p>
            </div>

            <div className="grid gap-5 sm:gap-6">
              {workProjects.map((project, index) => (
                <div
                  key={project.name}
                  className="grid gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4"
                >
                  <p className="text-[0.95rem] leading-none font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}/
                  </p>
                  <div className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-white/35 underline-offset-4 transition hover:decoration-white"
                    >
                      {project.name}
                    </a>{" "}
                    <span className="text-white/72">{project.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fun Projects */}
          <div className="grid gap-8 sm:gap-10">
            <div className="grid gap-3">
              <h2 className="text-[2rem] leading-none font-semibold text-white">
                fun projects
              </h2>
              <p className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white/72">
                built for fun, shipped anyway
              </p>
            </div>

            <div className="grid gap-5 sm:gap-6">
              {funProjects.map((project, index) => (
                <div
                  key={project.name}
                  className="grid gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4"
                >
                  <p className="text-[0.95rem] leading-none font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}/
                  </p>
                  <div className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-white/35 underline-offset-4 transition hover:decoration-white"
                    >
                      {project.name}
                    </a>{" "}
                    <span className="text-white/72">{project.description}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4">
              <p className="text-[0.95rem] leading-10 font-semibold text-white/72">
                more/
              </p>
              <a
                href="https://github.com/creation22"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-10 w-fit items-center text-[0.95rem] leading-relaxed font-semibold text-white underline decoration-white/35 underline-offset-4 transition hover:decoration-white"
              >
                more projects and experiments on github →
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
