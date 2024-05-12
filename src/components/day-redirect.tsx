"use client";

//LIBS
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DayRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/day");
  }, [router]);

  return null;
};

export default DayRedirect;
