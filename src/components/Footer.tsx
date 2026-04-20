export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 mt-16 bg-zinc-200 dark:bg-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-4">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            Created with <span className="text-red-500">♥</span> by Zach Attas
          </span>
          <span className="hidden sm:inline">•</span>
          <a
            href="https://github.com/snackattas/zattas.me"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors underline decoration-zinc-400 hover:decoration-zinc-900 dark:hover:decoration-zinc-100"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
