import ThoughtsBackLink from "@/components/ThoughtsBackLink";

// Sorted advanced → beginner
const technicalPosts = [
  {
    title: "where rag fails",
    category: "ai, retrieval, and the gaps no one talks about",
    link: "https://x.com/_Creation22/status/2014392615693889943",
  },
  {
    title: "what is chatgpt doing?",
    category: "ai, llms, and how they actually work",
    link: "https://x.com/_Creation22/status/2012927940515024956",
  },
  {
    title: "the smart clerk: building world-class search",
    category: "elasticsearch, search, and e-commerce",
    link: "https://medium.com/@creation2224/the-smart-clerk-building-world-class-search-4f22bc4dca79",
  },
  {
    title: "the shipping container revolution: docker",
    category: "docker, containers, and why they matter",
    link: "https://medium.com/@creation2224/the-shipping-container-revolution-docker-fe1c421fd277",
  },
  {
    title: "monolithic architecture",
    category: "system design, startups, and tradeoffs",
    link: "https://medium.com/@creation2224/monolithic-architecture-045aadbe7a64",
  },
  {
    title: "react fibre architecture",
    category: "react internals, reconciliation, and scheduling",
    link: "https://medium.com/@creation2224/react-fibre-architecture-0208914e51ba",
  },
  {
    title: "context api",
    category: "react, state management, and prop drilling",
    link: "https://medium.com/@creation2224/context-api-9a9b0446f35f",
  },
  {
    title: "create your custom react",
    category: "react from scratch, dom, and js",
    link: "https://medium.com/@creation2224/create-your-cutom-react-14bc3679f6cf",
  },
  {
    title: "getting started with react",
    category: "react basics and why it was built",
    link: "https://medium.com/@creation2224/getting-started-with-react-e011c5449643",
  },
];

export default function TechnicalPage() {
  return (
    <main className="flex min-h-[calc(100dvh-5rem)] items-center py-10 sm:py-14">
      <section className="w-full">
        <div className="grid gap-10 sm:gap-12">
          <ThoughtsBackLink href="/reflection" label="writing" />

          <div className="grid gap-3">
            <h1 className="text-[2rem] leading-none font-semibold text-white">
              technical
            </h1>
            <p className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white/72">
              code, systems, ai, and how things actually work
            </p>
          </div>

          <div className="grid gap-5 sm:gap-6">
            {technicalPosts.map((post, index) => (
              <div
                key={post.title}
                className="grid gap-2 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4"
              >
                <p className="text-[0.95rem] leading-none font-semibold text-white">
                  {String(index + 1).padStart(2, "0")}/
                </p>
                <div className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white">
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-white/35 underline-offset-4 transition hover:decoration-white"
                  >
                    {post.title}
                  </a>{" "}
                  <span className="text-white/72">{post.category}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}
