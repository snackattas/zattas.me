export function Footer() {
  return (
    <footer
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        marginTop: "100px",
        padding: "24px var(--gutter)",
        borderTop: "2px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "12px",
        fontFamily: "var(--font-space-mono)",
        fontSize: "0.72rem",
        color: "var(--muted)",
      }}
    >
      <span>© {new Date().getFullYear()} Zach Attas</span>

      {/* Konami hint */}
      <span style={{ fontSize: "0.68rem" }}>↑↑↓↓←→←→BA</span>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <a
          href="https://github.com/snackattas/zattas.me"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "var(--muted)" }}
        >
          source ↗
        </a>
        <a
          href="mailto:zach.attas@gmail.com"
          style={{ textDecoration: "none", color: "var(--muted)" }}
        >
          zach.attas@gmail.com
        </a>
      </div>
    </footer>
  );
}
