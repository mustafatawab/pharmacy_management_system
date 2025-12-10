import { AppShell } from "@/components/app-shell";

export default function POSLayout({ children }: { children: React.ReactNode }) {
  return <AppShell title="Pharmacy">{children}</AppShell>;
}
