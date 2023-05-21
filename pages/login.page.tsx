"use clint";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useAuth } from "~/hooks/auth";

export default function Login() {
  const { authMe } = useAuth();
  const router = useRouter();

  useEffect(() => {
    authMe().then(() => router.push("/"));
  }, [authMe]);
  return <div></div>;
}
