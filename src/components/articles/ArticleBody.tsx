type ArticleBodyProps = {
  paragraphs: string[];
};

export function ArticleBody({ paragraphs }: ArticleBodyProps) {
  return (
    <div className="space-y-5 text-base leading-relaxed text-zinc-700 md:text-[17px] md:leading-[1.75]">
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
