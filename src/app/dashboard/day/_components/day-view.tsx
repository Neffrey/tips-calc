// LIBS
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaCheck,
  FaDollarSign,
  FaExclamationCircle,
  FaRegClock,
} from "react-icons/fa";
import { z } from "zod";

// HELPERS
import useDataStore from "~/components/stores/data-store";
import useThemeStore from "~/components/stores/theme-store";
import { getDaysDifference } from "~/lib/time-date";
import { twoDecimals } from "~/lib/utils";
import { api } from "~/trpc/react";

// COMPONENTS
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import DayControlBtns from "./day-control-btns";
import DaySkeleton from "./day-skeleton";

// CONSTANTS
export const addTipFormSchema = z.object({
  hours: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: "Hourly must be a number",
  }),
  amount: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: "Hourly must be a number",
  }),
  cashDrawerStart: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: "Hourly must be a number",
  }),
  cashDrawerEnd: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: "Hourly must be a number",
  }),
});

// COMP
const DayView = () => {
  const cashDrawer = useThemeStore((state) => state.cashDrawer);
  const setCashDrawer = useThemeStore((state) => state.setCashDrawer);

  const currentDate = useDataStore((state) => state.currentDate);
  const viewDate = useDataStore((state) => state.viewDate);
  const setCurrentDate = useDataStore((state) => state.setCurrentDate);
  const msUntilNextDate = useDataStore((state) => state.msUntilNextDate);
  const tips = useDataStore((state) => state.tips);
  // const addDayToViewMonthTippedDays = useDataStore(
  //   (state) => state.addDayToViewMonthTippedDays,
  // );

  // QUERIES
  const viewDatesTip = api.tip.findSingle.useQuery({
    date: viewDate,
  });

  const createTip = api.tip.create.useMutation({
    onSuccess: () => {
      void viewDatesTip.refetch();
      // addDayToViewMonthTippedDays(viewDate);
    },
  });

  const editTip = api.tip.edit.useMutation({
    onSuccess: () => {
      void viewDatesTip.refetch();
    },
  });

  // FORM
  const form = useForm<z.infer<typeof addTipFormSchema>>({
    resolver: zodResolver(addTipFormSchema),
    defaultValues: {
      hours: viewDatesTip?.data?.hours
        ? viewDatesTip.data.hours.toString()
        : "0",
      amount: viewDatesTip?.data?.amount
        ? viewDatesTip.data.amount.toString()
        : "0",
      cashDrawerStart: viewDatesTip?.data?.cashDrawerStart
        ? viewDatesTip.data.cashDrawerStart.toString()
        : "0",
      cashDrawerEnd: viewDatesTip?.data?.cashDrawerEnd
        ? viewDatesTip.data.cashDrawerEnd.toString()
        : "0",
    },
  });

  // SUBMIT
  const handleSubmit = (values: z.infer<typeof addTipFormSchema>) => {
    const validatedValues = {
      hours: values.hours,
      amount: values.amount,
      cashDrawerStart: values.cashDrawerStart,
      cashDrawerEnd: values.cashDrawerEnd,
      date: viewDate,
    };
    viewDatesTip.data
      ? editTip.mutate(validatedValues)
      : createTip.mutate(validatedValues);
  };

  // Keep Current Date Updated
  useLayoutEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate();
    }, msUntilNextDate);

    return () => clearInterval(interval);
  }, [msUntilNextDate, setCurrentDate]);

  // Calc UI States
  const calcViewDatesStats = () => {
    if (!viewDatesTip?.data) {
      return 0;
    }
    return twoDecimals(
      Number(viewDatesTip?.data?.amount ? viewDatesTip.data.amount : 0) +
        Number(
          viewDatesTip?.data?.cashDrawerEnd
            ? viewDatesTip.data.cashDrawerEnd
            : 0,
        ) -
        Number(
          viewDatesTip?.data?.cashDrawerStart
            ? viewDatesTip.data.cashDrawerStart
            : 0,
        ),
    );
  };

  // UI STATES
  const [viewDatesTotalMoney, setViewDatesTotalMoney] =
    useState<number>(calcViewDatesStats());

  // Update UI States
  useLayoutEffect(
    () => {
      setViewDatesTotalMoney(calcViewDatesStats());
    },
    // eslint-disable-next-line -- only want dependency on data
    [viewDatesTip.data],
  );

  // SET FORM VALUES ON DATA CHANGE
  useEffect(
    () => {
      // resetFormValues();
      if (!viewDatesTip.data) {
        form.setValue("amount", "0");
        form.setValue("hours", "0");
        form.setValue("cashDrawerStart", "0");
        form.setValue("cashDrawerEnd", "0");
      }
      if (viewDatesTip.data) {
        form.setValue("amount", viewDatesTip.data.amount.toString());
        form.setValue("hours", viewDatesTip.data.hours.toString());
        if (viewDatesTip.data.cashDrawerStart) {
          form.setValue(
            "cashDrawerStart",
            viewDatesTip.data.cashDrawerStart.toString(),
          );
        } else {
          form.setValue("cashDrawerStart", "0");
        }
        if (viewDatesTip.data.cashDrawerEnd) {
          form.setValue(
            "cashDrawerEnd",
            viewDatesTip.data.cashDrawerEnd.toString(),
          );
        }
        // Show cash drawer if either start or end is not 0
        if (
          (viewDatesTip.data.cashDrawerStart &&
            viewDatesTip.data.cashDrawerStart !== 0) ??
          (viewDatesTip.data.cashDrawerEnd &&
            viewDatesTip.data.cashDrawerEnd !== 0)
          // TODO: Keep open if profile default is cashDrawerOpen
        ) {
          setCashDrawer(true);
        } else {
          setCashDrawer(false);
        }
      }
    },

    // eslint-disable-next-line -- only want dependency on data
    [viewDatesTip.data, viewDate],
  );

  // RETURN COMPONENT
  return (
    <div className="flex flex-col gap-4">
      {viewDatesTip.isLoading && viewDatesTip?.data ? (
        <DaySkeleton />
      ) : (
        <div className="flex w-full flex-col items-center justify-between gap-2 rounded-lg bg-card px-4 py-3">
          <DayControlBtns />
          <div
            className={cn(
              "flex flex-wrap justify-between gap-3 rounded-lg bg-popover px-6 py-5 text-popover-foreground",
              viewDatesTip.data ? "" : "cursor-not-allowed",
            )}
          >
            <div className="flex flex-col">
              <h2 className="text-xl font-bold">
                {viewDate.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <h3 className="">{getDaysDifference(viewDate, currentDate)}</h3>
            </div>
            <div className="flex items-center">
              {viewDatesTip.data ? "Tip Entered" : "No Tip Data"}
              <div className="pl-3" />
              {viewDatesTip.data ? (
                <FaCheck className="text-primary" />
              ) : (
                <FaExclamationCircle className="text-accent" />
              )}
            </div>
            <div
              className={cn(
                "flex w-full",
                viewDatesTip.data
                  ? "text-popover-foreground"
                  : "text-popover-foreground/40",
              )}
            >
              <div className="flex w-full items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FaDollarSign />
                  <span>{viewDatesTotalMoney.toString() ?? "0"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaRegClock />
                  <span>
                    {/* {viewDatesTotalHours
                      ? twoDecimals(viewDatesTotalHours).toString()
                      : "0"} */}
                    {viewDatesTip?.data?.hours.toString() ?? "0"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span>$ per H</span>
                  <span>
                    {viewDatesTotalMoney && viewDatesTip?.data?.hours
                      ? twoDecimals(
                          viewDatesTotalMoney / viewDatesTip?.data?.hours,
                        ).toString()
                      : "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="py-4">
            <Button onClick={() => console.log("tips: ", tips)}>
              Log tips
            </Button>
          </div>

          <div className="pt-4" />
          <Separator className="w-4/5 bg-card-foreground/30" />

          {/* Form Section */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex w-full flex-col gap-4 p-6"
            >
              <h3 className="text-lg font-bold">
                {`${viewDatesTip.data ? "Edit Existing" : "Add"} Tip`}
              </h3>
              <div className="flex w-full justify-between gap-3">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-md">$ Tip total</FormLabel>
                      <FormControl>
                        <Input placeholder="0" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="title" className="text-md">
                        Hours
                      </FormLabel>
                      <FormControl>
                        <Input id="title" placeholder="0" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* cashDrawer section */}
              <div className="flex items-center gap-3 pt-1">
                <Checkbox
                  name="cashDrawerToggle"
                  checked={cashDrawer}
                  onCheckedChange={() => setCashDrawer(!cashDrawer)}
                />
                <label
                  htmlFor="cashDrawerToggle"
                  className="cursor-pointer"
                  onClick={() => setCashDrawer(!cashDrawer)}
                >
                  Cash Drawer
                </label>
              </div>
              {cashDrawer && (
                <div className="flex w-full justify-between gap-3">
                  <div className="flex w-1/2 justify-between gap-3">
                    <FormField
                      control={form.control}
                      name="cashDrawerStart"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-md">
                            $ Cash Drawer Start
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="0" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex w-1/2 justify-between gap-3">
                    <FormField
                      control={form.control}
                      name="cashDrawerEnd"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-md">
                            $ Cash Drawer End
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="0" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* bottom section */}
              <Button
                type="submit"
                className="rounded-xl px-8 py-6 text-xl font-bold"
              >
                {`${viewDatesTip.data ? "Edit" : "Add"} Tip`}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default DayView;
