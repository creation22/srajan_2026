import ThoughtsBackLink from "@/components/ThoughtsBackLink";

const lifeLogs = [
  {
    title: "everything i know about reddit marketing",
    category: "growth, communities, and what actually works",
    link: "https://x.com/_Creation22/status/2034527146925019149",
  },
  {
    title: "why i didn't go all-in on ai content",
    category: "writing, ai, and staying real",
    link: "https://x.com/_Creation22/status/2009346368788369690",
  },
  {
    title: "what reading a lot of books taught me",
    category: "books, learning, and honest takeaways",
    link: "https://x.com/_Creation22/status/2013596556419842334",
  },
  {
    title: "this is just going to be a raw blog of my thoughts and life right now",
    category: "life, goals, and locking in",
    link: "https://medium.com/@creation2224/this-is-just-going-to-be-a-raw-blog-of-my-thoughts-and-life-right-now-7cc5e9225417",
  },
  {
    title: "thinking about designing",
    category: "frontend, design taste, and figuring out what you like",
    link: "https://medium.com/@creation2224/thinking-about-designing-10-13-25-81ffd2d3698c",
  },
];

export default function LifeLogsPage() {
  return (
    <main className="flex min-h-[calc(100dvh-5rem)] items-center py-10 sm:py-14">
      <section className="w-full">
        <div className="grid gap-10 sm:gap-12">
          <ThoughtsBackLink href="/reflection" label="writing" />

          <div className="grid gap-3">
            <h1 className="text-[2rem] leading-none font-semibold text-white">
              life logs
            </h1>
            <p className="max-w-xl text-[0.95rem] leading-relaxed font-semibold text-white/72">
              thoughts, opinions, growth, and life — mostly unfiltered
            </p>
          </div>

          <div className="grid gap-5 sm:gap-6">
            {lifeLogs.map((post, index) => (
              <div
                key={post.link}
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
