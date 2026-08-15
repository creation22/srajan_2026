const workProjects = [
  {
    name: "dailygeeta.com",
    tag: "saas · acquired",
    link: "https://dailygeeta.com",
    description:
      "A daily spiritual learning product delivering Bhagavad Gita shloks with Hindi audio powered by Sarvam AI.",
  },
  {
    name: "riddlebox",
    tag: "multiplayer game",
    link: "https://riddlebox.heysrajan.com",
    description:
      "Real-time multiplayer game to solve CS riddles as fast as possible.",
  },
  {
    name: "altmangpt",
    tag: "ai / rag",
    link: "https://atlmangpt.heysrajan.com",
    description:
      "Ask startup questions grounded in Sam Altman's writing via RAG and vector embeddings.",
  },
];

export default function ProjectsSection({
  className,
  headingTag = "h2",
}: {
  className?: string;
  headingTag?: "h1" | "h2";
}) {
  const Heading = headingTag;
  const headingClassName =
    headingTag === "h1"
      ? "text-xl font-semibold mb-4 text-foreground"
      : "text-lg font-semibold mb-4 text-foreground";

  return (
    <section className={className}>
      <Heading className={headingClassName}>
        stuff i&apos;ve built
      </Heading>

      <div className="space-y-6">
        {workProjects.map((project) => (
          <div key={project.name}>
            <p className="text-muted text-sm">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline transition-colors font-medium"
              >
                {project.name}
              </a>{" "}
              <span className="text-muted/60 text-xs font-mono">[{project.tag}]</span> - {project.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
