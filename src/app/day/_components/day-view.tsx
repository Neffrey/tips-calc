// LIBS
import { useLayoutEffect } from "react";

// HELPERS
import { getDaysDifference } from "~/lib/time-date";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

// COMPONENTS
import useDataStore from "~/components/stores/data-store";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import BaseWageForm from "./base-wage-form";
import BaseWageInfo from "./base-wage-info";
import DataCheckSubtitle from "./data-check-subtitle";
import DayControlBtns from "./day-control-btns";
import TipForm from "./tip-form";
import TipInfo from "./tip-info";

// COMP
const DayView = () => {
  // STATE
  const currentDate = useDataStore((state) => state.currentDate);
  const viewDate = useDataStore((state) => state.viewDate);
  const viewDatesTip = useDataStore((state) => state.viewDatesTip);
  const setViewDatesTip = useDataStore((state) => state.setViewDatesTip);
  // const viewDatesBaseWage = useDataStore((state) => state.viewDatesBaseWage);
  const setViewDatesBaseWage = useDataStore(
    (state) => state.setViewDatesBaseWage,
  );
  const dayMode = useDataStore((state) => state.dayMode);
  const setDayMode = useDataStore((state) => state.setDayMode);

  // API
  const tipData = api.tip.findAll.useQuery();
  const baseWageData = api.baseWage.findAll.useQuery();

  // Keep ViewDatesData Updated
  useLayoutEffect(() => {
    if (dayMode === "tip") {
      setViewDatesTip(
        tipData?.data?.find(
          (data) => data.date.getTime() === viewDate.getTime(),
        ),
      );
    }
    if (dayMode === "basewage") {
      setViewDatesBaseWage(
        baseWageData?.data?.find(
          (data) => data.date.getTime() === viewDate.getTime(),
        ),
      );
    }
  }, [
    tipData?.data,
    baseWageData?.data,
    viewDate,
    setViewDatesTip,
    setViewDatesBaseWage,
    dayMode,
  ]);

  // useLayoutEffect(() => {
  //   setViewDatesBaseWage(
  //     baseWageData?.data?.find(
  //       (data) => data.date.getTime() === viewDate.getTime(),
  //     ),
  //   );
  // }, [viewDatesTip, setViewDatesBaseWage, baseWageData.data, viewDate]);

  // RETURN COMPONENT
  return (
    <div className="flex w-2/5 flex-col gap-4">
      {
        <div className="flex w-full flex-col items-center justify-between gap-2 rounded-lg bg-card px-4 py-3">
          <DayControlBtns />
          <div
            className={cn(
              "flex w-full flex-wrap justify-between gap-3 rounded-lg bg-popover px-6 py-5 text-popover-foreground",
              viewDatesTip ? "" : "cursor-not-allowed",
            )}
          >
            <div className="flex w-full flex-col">
              <h2 className="text-xl font-bold">
                {viewDate.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <button
                onClick={() =>
                  console.log(
                    tipData?.data?.find(
                      (data) => data.date.getTime() === viewDate.getTime(),
                    ),
                  )
                }
              >
                Log tipData
              </button>
              <div className="flex w-full justify-between gap-3">
                <h3 className="">{getDaysDifference(viewDate, currentDate)}</h3>

                <DataCheckSubtitle />
              </div>
              {dayMode === "tip" ? <TipInfo /> : <BaseWageInfo />}
            </div>
          </div>

          <div className="pt-2" />
          <Separator className="w-4/5 bg-card-foreground/30" />
          <div className="pt-2" />

          {/* Form Section */}
          <Tabs
            className="w-full rounded-lg bg-popover p-3 text-popover-foreground"
            value={dayMode}
          >
            <TabsList className="flex justify-center">
              <TabsTrigger
                className="w-full"
                value="tip"
                onClick={() => setDayMode("tip")}
              >
                Tips Mode
              </TabsTrigger>
              <TabsTrigger
                className="w-full"
                value="basewage"
                onClick={() => setDayMode("basewage")}
              >
                Base Wage Mode
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tip">
              <TipForm />
            </TabsContent>
            <TabsContent value="basewage">
              <BaseWageForm />
            </TabsContent>
          </Tabs>
        </div>
      }
    </div>
  );
};

export default DayView;
