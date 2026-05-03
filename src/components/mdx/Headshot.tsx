import Image from "next/image";

export function Headshot({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div style={{
      margin: "0 auto",
      height: "160px",
      width: "160px",
      overflow: "hidden",
      border: "2px solid var(--border)",
      background: "var(--bg)",
    }}>
      <div style={{ position: "relative", height: "100%", width: "100%" }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="160px"
          priority
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
