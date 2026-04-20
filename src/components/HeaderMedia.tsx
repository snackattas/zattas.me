import Image from "next/image";
import type { ReactNode } from "react";

export function HeaderMedia({
  posterSrc = "/images/coding-screenshot.jpg",
  posterAlt = "",
  videoMp4Src = "/videos/header.mp4",
  videoWebmSrc = "/videos/header.webm",
  heightClassName = "h-56 md:h-72",
  overlay,
  className,
}: {
  posterSrc?: string;
  posterAlt?: string;
  videoMp4Src?: string;
  videoWebmSrc?: string;
  heightClassName?: string;
  overlay?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden border-b border-zinc-200/80 bg-zinc-950 dark:border-zinc-800/80 ${heightClassName} ${className ?? ""}`}
    >
      <video
        className="absolute inset-0 z-10 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterSrc}
      >
        <source src={videoWebmSrc} type="video/webm" />
        <source src={videoMp4Src} type="video/mp4" />
      </video>

      <Image
        src={posterSrc}
        alt={posterAlt}
        fill
        sizes="100vw"
        priority
        className="z-0 object-cover"
      />

      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-black/55 via-black/25 to-transparent" />

      {overlay ? (
        <div className="absolute inset-x-0 top-0 z-30">{overlay}</div>
      ) : null}
    </div>
  );
}
