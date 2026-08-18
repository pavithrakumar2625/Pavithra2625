import { Link } from "@tanstack/react-router";

export function SiteFooter({ name, links }: { name: string; links: { id: string; platform: string; url: string }[] }) {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.platform}
            </a>
          ))}
          <Link to="/auth" className="text-muted-foreground transition-colors hover:text-foreground">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
