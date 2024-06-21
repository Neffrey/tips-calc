"use client";

// LIBS

// UTILS

// COMPONENTS
import TipData from "~/app/_components/tip-data";
import NotLoggedIn from "~/components/not-logged-in";
import ProtectedContent from "~/components/protectedContent";
import useDataStore from "~/components/stores/data-store";
import WeekCalender from "./_components/week-calendar";
import WeekView from "./_components/week-view";

// TYPES
export type TipData =
  | {
      id: string;
      user: string;
      date: Date;
      hours: number;
      amount: number;
      cashDrawerStart: number | null;
      cashDrawerEnd: number | null;
    }[]
  | null
  | undefined;

const WeekPage = () => {
  const viewMonth = useDataStore((state) => state.viewMonth);
  // const setViewMonthTippedDays = useDataStore(
  //   (state) => state.setViewMonthTippedDays,
  // );

  // Fetch viewMonth tips
  // const viewMonthsTips = api.tip.findWithinRange.useQuery({
  //   startDate: findViewMonthStart(viewMonth),
  //   endDate: findViewMonthEnd(viewMonth),
  // });

  // useLayoutEffect(
  //   () => {
  //     if (viewMonthsTips.data) {
  //       setViewMonthTippedDays(viewMonthsTips.data?.map((tip) => tip.date));
  //       setTipData(viewMonthsTips.data);
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
          Week Tracker
        </h1>
        <WeekCalender />
        <WeekView />
        {/* <div className="flex flex-col">
          monthStart: {findViewMonthStart(viewMonth).toLocaleDateString()}
          monthEnd: {findViewMonthEnd(viewMonth).toLocaleDateString()}
        </div> */}
      </ProtectedContent>
    </div>
  );
};

export default WeekPage;
