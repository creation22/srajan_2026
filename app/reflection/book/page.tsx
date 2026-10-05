import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import Book from "@/components/book/Book";
import ThoughtsBackLink from "@/components/ThoughtsBackLink";
import { book } from "@/content/book";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: book.title,
  description: `${book.subtitle}. a flip-through book: a quote on one page, the writing on the other.`,
  alternates: {
    canonical: "/reflection/book",
  },
};

export default function BookPage() {
  return (
    <main>
      <ThoughtsBackLink href="/reflection" label="writing" />
      <Book
        serif={fraunces.style.fontFamily}
        serifClassName={fraunces.className}
      />
    </main>
  );
}
