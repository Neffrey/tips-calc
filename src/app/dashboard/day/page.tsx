"use client";

// UTILS

// COMPONENTS
import TipData from "~/app/_components/tip-data";
import NotLoggedIn from "~/components/not-logged-in";
import ProtectedContent from "~/components/protectedContent";
import useDataStore from "~/components/stores/data-store";
import DayCalender from "./_components/day-calendar";
import DayView from "./_components/day-view";

const DayPage = () => {
  const viewMonth = useDataStore((state) => state.viewMonth);
  // const setViewMonthTippedDays = useDataStore(
  //   (state) => state.setViewMonthTippedDays,
  // );

  // Fetch viewMonth tips
  // const viewMonthsTips = api.tip.findWithinRange.useQuery({
  //   startDate: findViewMonthStart(viewMonth),
  //   endDate: findViewMonthEnd(viewMonth),
  // });

  // useEffect(
  //   () => {
  //     if (viewMonthsTips.data) {
  //       setViewMonthTippedDays(viewMonthsTips.data?.map((tip) => tip.date));
  //     }
  //   },
  //   // eslint-disable-next-line -- only when viewMonthsTips.data changes
  //   [viewMonthsTips.data],
  // );

  return (
    <div
      // HERO ROW
      className="flex w-full flex-wrap justify-around gap-12 bg-gradient-to-br from-background to-background/50 py-12 md:justify-center"
    >
      <ProtectedContent
        authedRoles={["ADMIN", "USER", "RESTRICTED"]}
        fallback={<NotLoggedIn />}
      >
        <TipData />
        <h1 className="center w-full text-center text-3xl font-bold uppercase tracking-widest">
          Day Tracker
        </h1>
        <DayCalender />
        <DayView />
      </ProtectedContent>
    </div>
  );
};

export default DayPage;
