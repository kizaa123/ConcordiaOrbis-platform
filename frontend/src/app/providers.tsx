"use client";

import { AuthProvider } from "@/context/AuthProvider";
import { NotificationProvider } from "@/context/NotificationProvider";
import { AppShell } from "@/components/AppShell";
import { WhatsAppSupportHost } from "@/components/SupportWhatsAppLink";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppShell>{children}</AppShell>
        <WhatsAppSupportHost />
      </NotificationProvider>
    </AuthProvider>
  );
}
