import { StartWizardProvider } from "@/components/start/StartWizardProvider";

export default function StartLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StartWizardProvider>{children}</StartWizardProvider>;
}
