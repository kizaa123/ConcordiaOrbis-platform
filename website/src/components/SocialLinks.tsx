import { SOCIAL } from "@/lib/company";

const ICONS = {
  instagram: (
    <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5Zm0 2A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5ZM17.25 6.5a.75.75 0 1 0 .75.75.75.75 0 0 0-.75-.75Z" />
  ),
  facebook: (
    <path d="M14 8h2.5V4.8H14c-2.1 0-3.5 1.6-3.5 3.9V11H8v3.2h2.5V20H14v-5.8h2.4L17 11h-3V9.1c0-.6.2-1.1 1-1.1Z" />
  ),
  linkedin: (
    <path d="M6.5 9.5H4V20h2.5V9.5ZM5.25 4A1.75 1.75 0 1 0 7 5.75 1.75 1.75 0 0 0 5.25 4ZM20 20h-2.5v-5.4c0-1.7-.6-2.8-2.1-2.8-1.1 0-1.8.8-2.1 1.5-.1.3-.1.7-.1 1.1V20H11s.03-9.2 0-10.2h2.5v1.4c.4-.6 1.4-1.6 3.3-1.6 2.4 0 4.2 1.6 4.2 5V20Z" />
  ),
  x: (
    <path d="M17.5 4h2.2l-4.8 5.5L21 20h-5.2l-3.3-4.3L8.2 20H6l5.1-5.9L4 4h5.3l3 4 5.2-4Zm-1 14.4h1.2L8.6 5.5H7.3l9.2 12.9Z" />
  ),
  youtube: (
    <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2 28 28 0 0 0 2 12a28 28 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 22 12a28 28 0 0 0-.4-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z" />
  ),
} as const;

const LINKS = [
  {
    href: SOCIAL.instagram,
    label: "Instagram",
    icon: "instagram" as const,
    className: "bg-[linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)]",
  },
  {
    href: SOCIAL.facebook,
    label: "Facebook",
    icon: "facebook" as const,
    className: "bg-[#1877F2]",
  },
  {
    href: SOCIAL.linkedin,
    label: "LinkedIn",
    icon: "linkedin" as const,
    className: "bg-[#0A66C2]",
  },
  {
    href: SOCIAL.x,
    label: "X",
    icon: "x" as const,
    className: "bg-black",
  },
  {
    href: SOCIAL.youtube,
    label: "YouTube",
    icon: "youtube" as const,
    className: "bg-[#FF0000]",
  },
];

export function SocialLinks({
  theme = "dark",
  className = "",
}: {
  theme?: "dark" | "light";
  className?: string;
}) {
  const ring = theme === "light" ? "hover:ring-white/40" : "hover:ring-brand-200";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {LINKS.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm ring-2 ring-transparent transition hover:scale-110 hover:shadow-md ${ring} ${item.className}`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden>
            {ICONS[item.icon]}
          </svg>
        </a>
      ))}
    </div>
  );
}
