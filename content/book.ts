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

and honestly, i am incredibly grateful to God for all of this. for the work, for the people around me, and for the fact that i even get to spend time building my own stuff and learning the things i care about. a lot of people never get that chance. i don't want to waste it. so i am going to keep showing up, keep building, and release more of what i make, even when it isn't perfect.
`,
    },
    {
      number: 2,
      title: "the grind",
      wallpapers: [
        {
          src: "/book/chapter-two.png",
          alt: "the grind.",
        },
      ],
      text: `
when does the grind end.

when i was really young, every year a summer vacation came and it felt like the same question. when will the time come when i don't have to. when i can just lie in my bed and enjoy the day by doing nothing at all. i thought that day was waiting somewhere after school. a permanent version of the vacation. a life where nothing was being asked of me.

that time never came.

i kept looking for it, year after year, and it was never there. and the longer i sit with that, the less it feels like bad news. life has very little meaning when you are not putting in the work. i mean that in the plain way. if you are not working, what are you actually going to do. you can rest. rest is real, and some days you should take it. but a whole life of not doing anything is not peace. it is a person slowly becoming less of a person. at a certain point the people who love you get bored of you too. not because they are cruel. because love is a kind of attention, and there is less and less to attend to in someone who has stopped becoming anything.

so i don't think the empty day was ever the point. i think i was wrong about what i was waiting for. i really enjoy the time when i am working on something meaningful. the day feels like it belongs to me then, in a way the empty ones never did. the work is not the thing i do until my life starts. a lot of the time, the work is the life.

there is a good test for whether you are working on something that is actually yours. watch how the day moves. if it passes quickly, you are in it. you will not get the time to step outside and ask whether you enjoy this. that question only shows up when the hours drag and you are watching yourself work. a fast day has already answered.

there will be stretches where you cannot give time to the people you love, or to the small playful things that make a week feel human. i think that is fine. there are seasons of ultimate grind. i am in one. i have to keep my head down and work, for at least the next five years, if i want to reach a place that is actually good. not a soft place someone hands me. a place i have earned, where the work is mine and i am not being carried.

nothing comes easy. if someone tells you there is a way to earn money easily, i don't think that way exists. what exists is a long stretch of hard work in the background, and then a last inch that looks easy to everyone who wasn't there for the rest of it. i would rather be the person in the background.

so the work of this season is simple, and it is not short. work really well. then, after a certain point, chase a real balance, so i can give time back to the people i love. the grind is not the whole of a good life. it is the part that comes first. five years with my head down, and then a life that has room in it again.

---

the body has started to disagree with me.

for the last few days my back has been in severe pain. it is an ordinary problem, and it is also the most useful thing i have felt all week. if i am not taking care of my health, i cannot sustain this for any serious length of time. the five years are a story i am telling myself if my back gives out in the second month. a season of grind that destroys the body is not a season. it ends the work early, and then you have neither the achievement nor the health.

so this is the right time to join the gym. not as a reward for later, and not as something i will get to once the work calms down. the work is not going to calm down. health is not a break from the grind. it is the only reason the grind can last. if i want the next five years, i have to be a person who can still stand up for them.

the day with nothing to do is not coming. i don't think i want it anymore. i want the days to pass quickly because the work means something, and i want to still be healthy enough, when those five years are over, to give time to the people i love.
`,
    },
  ],
};
