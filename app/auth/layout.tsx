import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex items-center justify-center h-screen">
      {children}
    </main>
  );
}
