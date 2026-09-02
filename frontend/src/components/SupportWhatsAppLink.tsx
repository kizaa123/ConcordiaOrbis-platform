import { Icon } from "@/components/icons";
import { SUPPORT_WHATSAPP_URL } from "@/lib/site";

const WHATSAPP_GREEN = "#25D366";

type SupportWhatsAppLinkProps = {
  className?: string;
  label?: string;
  iconClassName?: string;
};

export function SupportWhatsAppLink({
  className = "",
  label = "Support & Assistant",
  iconClassName = "h-5 w-5",
}: SupportWhatsAppLinkProps) {
  return (
    <a
      href={SUPPORT_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <Icon name="whatsapp" className={iconClassName} />
      {label}
    </a>
  );
}

export function WhatsAppSupportFab() {
  return (
    <a
      href={SUPPORT_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp Support and Assistant"
      title="WhatsApp Support & Assistant"
      className="fixed z-[70] flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105 hover:brightness-110 bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] right-4 lg:bottom-6 lg:right-6"
      style={{ backgroundColor: WHATSAPP_GREEN }}
    >
      <Icon name="whatsapp" className="h-6 w-6" />
    </a>
  );
}
