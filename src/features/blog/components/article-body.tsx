import type { Block } from "@/features/blog/mock-posts";

type Props = { blocks: Block[] };

export function ArticleBody({ blocks }: Props) {
  return (
    <div data-reveal="up" className="mt-10 flex flex-col gap-5">
      {blocks.map((block, index) =>
        block.type === "h" ? (
          <h2 key={index} className="mt-4 font-display text-xl text-encre">
            {block.text}
          </h2>
        ) : (
          <p key={index} className="text-base leading-[1.75] text-texte2 text-pretty">
            {block.text}
          </p>
        ),
      )}
    </div>
  );
}
