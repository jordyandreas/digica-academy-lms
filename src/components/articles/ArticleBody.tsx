type ArticleBodyProps = {
  paragraphs: string[];
};

export function ArticleBody({ paragraphs }: ArticleBodyProps) {
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-zinc-700 md:text-base">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
