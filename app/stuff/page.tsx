import ThoughtsBackLink from "@/components/ThoughtsBackLink";

const workProjects = [
  {
    name: "dailygeeta.com",
    tag: "saas · acquired",
    link: "https://dailygeeta.com",
    description:
      "A daily spiritual learning product that delivers one Bhagavad Gita shlok every morning, with Hindi audio explanations powered by Sarvam AI.",
  },
  {
    name: "riddlebox",
    tag: "multiplayer game",
    link: "https://riddlebox.heysrajan.com",
    description:
      "A real-time multiplayer game where you and your friends compete to solve CS riddles as fast as possible.",
  },
  {
    name: "altmangpt",
    tag: "ai / rag",
    link: "https://atlmangpt.heysrajan.com",
    description:
      "Ask startup questions and get answers grounded in Sam Altman's writing, using RAG and vector embeddings to retrieve relevant insights from his blogs.",
  },
];

const funProjects = [
  {
    name: "marveltimeline.space",
    tag: "web app",
    link: "https://marveltimeline.space",
    description:
      "A simple chronological guide to watching the entire Marvel universe, built for anyone who has no idea where to start.",
  },
  {
    name: "checkhiscount.space",
    tag: "social experiment",
    link: "https://checkhiscount.space",
    description:
      "Enter an Instagram username and get a playful estimate of someone's \"body count.\" Built as a fun experiment around social media data and internet culture.",
  },
  {
    name: "talksense",
    tag: "chat analyzer",
    link: "https://talksense.heysrajan.com",
    description:
      "Upload your WhatsApp chat and discover how you actually communicate - from conversation patterns to who texts first and how the dynamic changes over time.",
  },
  {
    name: "rupeerush",
    tag: "game",
    link: "https://rupeerush.srajan.online",
    description:
      "A hill-climb racing game where the terrain is shaped by the USD/INR exchange rate. The rupee falls, the car climbs.",
  },
  {
    name: "bemyvalentine.fun",
    tag: "web experiment",
    link: "https://bemyvalentine.fun",
    description:
      "A playful way to ask someone out, designed to make saying \"yes\" feel like the obvious choice.",
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

            <div className="grid gap-6 sm:gap-7">
              {workProjects.map((project, index) => (
                <div
                  key={project.name}
                  className="grid gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4"
                >
                  <p className="text-[0.95rem] leading-none font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}/
                  </p>
                  <div className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-white/35 underline-offset-4 transition hover:decoration-white"
                      >
                        {project.name}
                      </a>
                      <span className="text-white/50 text-[0.82rem] font-mono">
                        [{project.tag}]
                      </span>
                    </div>
                    <p className="mt-1 text-white/72 text-[0.92rem]">
                      {project.description}
                    </p>
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

            <div className="grid gap-6 sm:gap-7">
              {funProjects.map((project, index) => (
                <div
                  key={project.name}
                  className="grid gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4"
                >
                  <p className="text-[0.95rem] leading-none font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}/
                  </p>
                  <div className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-white/35 underline-offset-4 transition hover:decoration-white"
                      >
                        {project.name}
                      </a>
                      <span className="text-white/50 text-[0.82rem] font-mono">
                        [{project.tag}]
                      </span>
                    </div>
                    <p className="mt-1 text-white/72 text-[0.92rem]">
                      {project.description}
                    </p>
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
                More projects, experiments, and things I probably shouldn&apos;t have built → github
              </a>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
