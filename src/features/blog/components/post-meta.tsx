import type { Post } from "@/features/blog/mock-posts";
import { formatDate } from "@/lib/format/date";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { avatarPreviewBg } from "@/lib/preview-image";

type Props = { post: Post; lang: Locale; dict: Dictionary };

export function PostMeta({ post, lang, dict }: Props) {
  const pill = "rounded-full border border-ligne px-3 py-1";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ligne pt-6">
      <div className="flex items-center gap-3">
        <span
          style={avatarPreviewBg(post.author.avatar)}
          className="h-10 w-10 flex-shrink-0 rounded-full bg-menthe"
        />
        <span>
          <span className="block text-xs text-texte2">{dict.blog.writtenBy}</span>
          <span className="block text-sm font-semibold text-encre">{post.author.name}</span>
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[13px] text-texte2">
        <span className={`${pill} font-medium`}>{post.category}</span>
        <span className={pill}>{formatDate(post.date, lang)}</span>
        <span className={pill}>
          {post.readMinutes} {dict.blog.minRead}
        </span>
      </div>
    </div>
  );
}
