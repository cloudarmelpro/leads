import type { Block } from "@/features/blog/mock-posts";

type Props = { blocks: Block[] };

const P = "m-[0px] text-[17px] leading-[30px] font-normal text-prose text-pretty";

/**
 * Corps d'article de la maquette : paragraphes 17/30, intertitres H2 à 18px de marge
 * haute, listes à puces, citation sur filet vert de 2px.
 */
export function ArticleBody({ blocks }: Props) {
  return (
    <div className="flex flex-col gap-[22px]">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h":
            return (
              <h2 key={index} className="mt-[18px] mb-[0px] text-[clamp(20px,2.2vw,24px)] leading-[1.25] font-normal tracking-[-0.4px] text-encre text-pretty">
                {block.text}
              </h2>
            );
          case "ul":
            return (
              <ul key={index} className="m-[0px] flex list-disc flex-col gap-[10px] pl-[22px]">
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
                <p className="m-[0px] text-[clamp(18px,2vw,21px)] leading-[1.5] font-normal tracking-[-0.2px] text-encre text-pretty">{block.text}</p>
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
