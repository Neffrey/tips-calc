"use client";

//LIBS
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DayRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/day");
  }, [router]);

  return null;
};

export default DayRedirect;
