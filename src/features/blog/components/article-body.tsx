import type { Block } from "@/features/blog/mock-posts";

type Props = { blocks: Block[] };

const P = "m-[0px] text-[15px] leading-[26px] font-normal text-texte2 text-pretty";

/**
 * Corps d'article aux tailles du site : paragraphes 15/26, intertitres à la taille des
 * titres de section, listes à puces, citation sur filet vert de 2px.
 */
export function ArticleBody({ blocks }: Props) {
  return (
    <div className="flex flex-col gap-[18px]">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h":
            return (
              <h2 key={index} className="mt-[22px] mb-[0px] text-[clamp(22px,2.2vw,30px)] leading-[1.2] font-semibold tracking-[-0.01em] text-encre text-pretty">
                {block.text}
              </h2>
            );
          case "ul":
            return (
              <ul key={index} className="m-[0px] flex list-disc flex-col gap-[8px] pl-[22px]">
                {block.items.map((item) => (
                  <li key={item} className={P}>
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote key={index} className="m-[0px] border-l-2 border-vert py-[4px] pl-[20px]">
                <p className="m-[0px] text-[15px] leading-[26px] font-medium text-encre text-pretty">{block.text}</p>
              </blockquote>
            );
          default:
            return (
              <p key={index} className={P}>
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
