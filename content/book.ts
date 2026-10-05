// The writing book at /reflection/book.
//
// Every spread is a quote page on the left and your words on the right.
// Write each chapter's `text` as plain paragraphs separated by a blank line;
// the book lays it out and adds as many pages as the chapter needs, giving
// each new page the next wallpaper in the list.
//
//   *word*   italic
//   ---      scene break (on its own line)
//
// Quote pages are drawn in code: a quiet line motif per scene, no image files.
// To use your own picture, drop it in public/book/ and add { src: "/book/x.jpg" }
// to a chapter's `wallpapers` (or the shared list). A picture on its own is
// shown whole on a light page; give it a `quote` and it becomes a darkened
// black-and-white background behind the quote instead.

export type SceneName = "summit" | "storm" | "redsun" | "city" | "king" | "embers";

export type Wallpaper =
  | { scene: SceneName; quote: string; by: string }
  | { src: string; alt?: string; quote?: string; by?: string };

export type Chapter = {
  number: number;
  title: string;
  text: string;
  // pictures for this chapter's first pages; later pages use the shared list
  wallpapers?: Wallpaper[];
};

export type Book = {
  title: string;
  author: string;
  subtitle: string;
  epigraph: { quote: string; by: string };
  ending: { title: string; note: string };
  wallpapers: Wallpaper[];
  chapters: Chapter[];
};

export const book: Book = {
  title: "learnings",
  author: "srajan",
  subtitle: "a book by srajan",
  epigraph: {
    quote: "far and away the best prize that life offers is the chance to work hard at work worth doing.",
    by: "theodore roosevelt",
  },
  ending: {
    title: "to be continued",
    note: "more chapters as i live them.",
  },

  wallpapers: [
    { scene: "summit", quote: "what stands in the way becomes the way.", by: "marcus aurelius" },
    { scene: "storm", quote: "we suffer more often in imagination than in reality.", by: "seneca" },
    { scene: "redsun", quote: "he who has a why to live can bear almost any how.", by: "friedrich nietzsche" },
    { scene: "king", quote: "fortune favors the bold.", by: "virgil" },
    { scene: "city", quote: "waste no more time arguing what a good man should be. be one.", by: "marcus aurelius" },
    { scene: "embers", quote: "no man is free who is not master of himself.", by: "epictetus" },
  ],

  chapters: [
    {
      number: 1,
      title: "87 days",
      wallpapers: [
        {
          src: "/book/chapter-one.webp",
          alt: "how it feels to fight someone you know is stronger but you have to show them the indomitable human spirit",
        },
      ],
      text: `
life is not going great right now.

which is strange, because objectively, it probably should be. i am working at a really good place, with a really good team, doing the kind of work i wanted to do. in many ways, i have everything i used to want. but there is almost no time to rest. i wake up thinking about work, spend most of my day working, and then think about everything i should be learning after work.

i genuinely believe that a lot of life comes down to effort. most people simply don't put in the amount of effort required to become exceptional at something. and maybe that sounds arrogant, but i have always had this belief that if i really want something, i am going to get it. there is no doubt about it.

the problem is that this mindset can consume everything else.

my schedule is completely messed up right now. work gets most of my attention, while health, gym, relationships, personal time, and everything else slowly gets pushed aside. there is always another thing to learn, another book to finish, another skill to develop, another thing i could be doing.

i used to think life worked in seasons. when i was younger, every summer vacation felt like a temporary escape from school. i thought that one day, eventually, there would be a permanent version of that feeling. a point in life where i wouldn't have to worry about the next exam, the next job, the next thing i had to prepare for. i would finally just be able to rest.

i don't think that time is coming.

maybe there is no phase of life where everything becomes peaceful and you simply stop worrying about the future. maybe there is just life. you work, you learn, you grow, you get tired, you recover, you become ambitious again. there are no permanent seasons of happiness. there are just moments of happiness scattered throughout everything else.

a good conversation. a great workout. finishing something difficult. building something that works. spending time with people you love. those moments might be the actual point, rather than something we are supposed to wait for.

i also think we are here to serve some kind of purpose. to provide some kind of value. to become capable of creating something that matters. i don't know exactly what that purpose looks like for me yet, but becoming extremely good at what i do feels like part of it.

when i talk to people senior to me, i usually have one of two reactions. either i admire them and think, “i want to become like this someday,” or i look at them and think, “i am going to be 10x better than this.” i don't really believe anyone is inherently better than me. they simply have more experience right now. and i want to use that experience gap as motivation rather than intimidation.

so for the next 87 days, i want to figure out how to build a life where i can work hard, learn aggressively, become a better ai engineer, stay physically healthy, maintain relationships, and still have some space to actually live.

because anyone can sacrifice everything for a few months. the harder thing is becoming better without destroying everything else in the process.

there are still 87 days left before the year ends.

so, for now, lock in.

lock the fuck in.

you already know what you're capable of. somewhere deep down, you know exactly how far you could go if you genuinely committed yourself to something.

i also want to create more. x, instagram, youtube, whatever. because potential that nobody can see is almost useless. you can be incredibly capable, but if you never put anything into the world, nobody knows.

the job market is crazy. standing out matters. building matters. sharing matters.

maybe some of what i create will be bad. maybe nobody will care. that's fine.

i just don't want to spend my life wondering what i could have done.

these are just some raw thoughts from today. i don't even know if i'll keep this post up.

but for now, there are still 87 days.

let's see what happens.
`,
    },
  ],
};
