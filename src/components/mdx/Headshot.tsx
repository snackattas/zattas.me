import Image from "next/image";

export function Headshot({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950">
      <div className="relative h-full w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="160px"
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}
