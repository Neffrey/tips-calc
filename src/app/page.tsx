//LIBS
import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";

// COMPONENTS
import ProtectedContent from "~/components/protectedContent";

const Home = async () => {
  noStore();

  return (
    <div
      // HERO ROW
      className="flex w-full flex-wrap items-center justify-around gap-12 bg-gradient-to-br from-background to-background/50 py-12 md:justify-center"
    >
      <ProtectedContent
        authedRoles={["ADMIN", "USER", "RESTRICTED"]}
        fallback={<div>You gotta login foo</div>}
      >
        <div className="flex w-full flex-col items-center gap-6">
          Omfg it worked. You be logged in!
        </div>
      </ProtectedContent>
    </div>
  );
};

export default Home;
