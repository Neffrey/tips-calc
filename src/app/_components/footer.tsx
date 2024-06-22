"use client";

// LIBRARIES
import Link from "next/link";
import useDataStore from "~/components/stores/data-store";

// COMPONENTS
import { Button } from "~/components/ui/button";

const Footer = () => {
  const currentTime = useDataStore((state) => state.currentDate);
  const currentDate = useDataStore((state) => state.currentDate);

  return (
    <div
      // Row Container
      className="flex w-full flex-wrap items-center justify-center border-t-4 border-solid border-secondary-foreground bg-gradient-to-r from-secondary to-muted px-5 py-6 shadow-xl"
    >
      <h3 className="text-center text-lg font-semibold lowercase tracking-widest text-secondary-foreground">
        Made with love by
      </h3>
      <Link
        href="https://neffrey.com"
        target="_blank"
        rel="noopener noreferrer"
        passHref
      >
        <Button
          variant="link"
          className="text-lg tracking-widest text-secondary-foreground"
        >
          neffrey
        </Button>
      </Link>
      <div className="flex w-full flex-col">
        <p className="w-full text-center text-sm text-secondary-foreground">
          {`Current Time: ${currentTime.toLocaleTimeString()}`}
        </p>
        <p className="w-full text-center text-sm text-secondary-foreground">
          {`Current Times Date: ${currentTime.toLocaleDateString()}`}
        </p>
        <p className="w-full text-center text-sm text-secondary-foreground">
          {`Current Date: ${currentDate.toLocaleDateString()}`}
        </p>
      </div>
    </div>
  );
};

export default Footer;
