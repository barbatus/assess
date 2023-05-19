import { useEffect } from "react";
import { Inter } from "@next/font/google";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add("tw");
  });
  return (
    <main className={clsx("flex h-screen flex-col", inter.className)}>
      <nav className="fixed top-0 z-50 w-full border-b border-base-300">
        <div className="px-3 py-3 lg:px-5">
          <div className="flex items-center justify-end">Navbar</div>
        </div>
      </nav>
      <div className="pt-16 flex-1 container max-sm:pl-1 max-sm:pr-1 max-w-5xl mx-auto">{children}</div>
    </main>
  );
}
