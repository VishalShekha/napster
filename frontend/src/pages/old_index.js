import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page as soon as the component loads
    router.push("/login"); // Replace '/login' with the actual login page path if it's different
  }, [router]);

  return null; // No content needed, just the redirect
}
