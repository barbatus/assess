"use clint";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { useAuth } from "~/hooks/auth";

export default function Login() {
  const { authMe } = useAuth();
  const router = useRouter();

  useEffect(() => {
    authMe();
  }, [authMe]);

  return (
    <div className="mt-5 w-6 mx-auto">
      <Loader2 className="animate-spin h-6 w-6" />
    </div>
  );
}
