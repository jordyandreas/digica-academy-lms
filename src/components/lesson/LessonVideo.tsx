"use client";

interface LessonVideoProps {
  videoUrl: string;
  title: string;
}

export function LessonVideo({ videoUrl, title }: LessonVideoProps) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-900">
      <video
        className="h-full w-full object-contain"
        src={videoUrl}
        title={title}
        controls
        playsInline
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
