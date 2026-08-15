const workProjects = [
  {
    name: "dailygeeta.com",
    link: "https://dailygeeta.com",
    description:
      "saas (acquired) — daily shloks with hindi audio explanation via sarvam ai",
  },
  {
    name: "riddlebox",
    link: "https://riddlebox.heysrajan.com",
    description: "multiplayer cs riddle game",
  },
  {
    name: "altmangpt",
    link: "https://atlmangpt.heysrajan.com",
    description:
      "answer your startup problems through sam altman blogs — rag + vector embeddings",
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
              - {project.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
