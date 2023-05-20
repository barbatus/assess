import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Inter } from "@next/font/google";
import clsx from "clsx";

import { useFeed } from "~/hooks/user-books";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add("tw");
  });
  const router = useRouter();
  const onLocaleChange = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
  };
  useFeed();

  return (
    <main className={clsx("flex h-screen flex-col", inter.className)}>
      <nav className="fixed top-0 z-50 w-full border-b border-base-300">
        <div className="px-4 py-2 lg:px-5">
          <div className="flex items-center justify-end">
            <Button
              variant="link"
              size="sm"
              className={clsx("pr-0", { underline: router.pathname.includes("/home") })}
            >
              <Link href="/" locale={router.locale}>
                Books
              </Link>
            </Button>
            <Button
              variant="link"
              size="sm"
              className={clsx("mr-4", { underline: router.pathname === "/feed" })}
            >
              <Link href="/feed" locale={router.locale}>
                Feed
              </Link>
            </Button>
            <Select value={router.locale} onValueChange={onLocaleChange}>
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="pl">PL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </nav>
      <div className="pt-16 flex-1 container max-sm:pl-1 max-sm:pr-1 max-w-5xl mx-auto">
        {children}
      </div>
    </main>
  );
}
