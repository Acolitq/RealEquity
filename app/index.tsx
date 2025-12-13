import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/lib/store/auth";
import { Loading } from "@/components/ui/Loading";

export default function Index() {
  const router = useRouter();
  const { session, isInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized) {
      if (session) {
        router.replace("/tabs");
      } else {
        router.replace("/auth/login");
      }
    }
  }, [session, isInitialized]);

  return <Loading fullScreen message="Loading..." />;
}
