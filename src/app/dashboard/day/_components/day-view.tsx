// LIBS
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FaCheck,
  FaExclamationCircle,
  FaRegClock,
  FaDollarSign,
} from "react-icons/fa";
import { z } from "zod";

// HELPERS
import useThemeStore from "~/components/stores/theme-store";
import useTimeStore from "~/components/stores/time-store";
import { getDaysAgo } from "~/lib/time-date";
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
import DayPrevNext from "./day-prev-next";
import DaySkeleton from "./day-skeleton";
import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";

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

  const currentDate = useTimeStore((state) => state.currentDate);
  const viewDate = useTimeStore((state) => state.viewDate);
  const setCurrentDate = useTimeStore((state) => state.setCurrentDate);
  const msUntilNextDate = useTimeStore((state) => state.msUntilNextDate);

  // QUERIES
  const viewDatesTip = api.tip.findSingle.useQuery({
    date: viewDate,
  });

  const createTip = api.tip.create.useMutation({
    onSuccess: () => {
      void viewDatesTip.refetch();
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
        ? viewDatesTip.data.cashDrawerStart
        : "0",
      cashDrawerEnd: viewDatesTip?.data?.cashDrawerEnd
        ? viewDatesTip.data.cashDrawerEnd
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

  // SET FORM VALUES ON DATA CHANGE
  useEffect(
    () => {
      // resetFormValues();

      if (viewDatesTip.data) {
        form.setValue("amount", viewDatesTip.data.amount.toString());
        form.setValue("hours", viewDatesTip.data.hours.toString());
        if (viewDatesTip.data.cashDrawerStart) {
          form.setValue("cashDrawerStart", viewDatesTip.data.cashDrawerStart);
        }
        if (viewDatesTip.data.cashDrawerEnd) {
          form.setValue("cashDrawerEnd", viewDatesTip.data.cashDrawerEnd);
        }
        // Show cash drawer if either start or end is not 0
        if (
          (viewDatesTip.data.cashDrawerStart &&
            viewDatesTip.data.cashDrawerStart !== "0") ??
          (viewDatesTip.data.cashDrawerEnd &&
            viewDatesTip.data.cashDrawerEnd !== "0")
          // TODO: Keep open if profile default is cashDrawerOpen
        ) {
          setCashDrawer(true);
        } else {
          setCashDrawer(false);
        }
      } else {
        form.setValue("amount", "0");
        form.setValue("hours", "0");
        form.setValue("cashDrawerStart", "0");
        form.setValue("cashDrawerEnd", "0");
      }
    },

    // eslint-disable-next-line -- only want dependency on data
    [viewDatesTip.data, viewDate],
  );

  // Keep Current Date Updated
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate();
    }, msUntilNextDate);

    return () => clearInterval(interval);
  }, [msUntilNextDate, setCurrentDate]);

  return (
    <div className="flex flex-col gap-4">
      {viewDatesTip.isLoading && viewDatesTip?.data ? (
        <DaySkeleton />
      ) : (
        <div className="flex w-full flex-col justify-between gap-2 rounded-lg bg-card px-3 py-4">
          <div
            className={cn(
              "flex flex-wrap justify-between gap-3 rounded-lg bg-popover px-5 py-2 text-popover-foreground",
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
              <h3 className="">{getDaysAgo(viewDate, currentDate)}</h3>
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
                  <span>
                    {viewDatesTip.data?.amount
                      ? twoDecimals(viewDatesTip.data.amount)
                      : "0"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FaRegClock />
                  <span>
                    {viewDatesTip.data?.hours
                      ? twoDecimals(viewDatesTip.data.hours)
                      : "0"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span>$ per H</span>
                  <span>
                    {viewDatesTip.data?.hours && viewDatesTip.data?.amount
                      ? twoDecimals(
                          viewDatesTip.data.amount / viewDatesTip.data.hours,
                        )
                      : "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Separator className="" />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4 p-6"
            >
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
              <div className="flex w-full justify-between gap-3">
                {/* <div className="flex flex-col items-end justify-end p-4">
              {viewDate.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div> */}
              </div>
              <Button
                type="submit"
                className="rounded-xl px-8 py-6 text-xl font-bold"
              >
                {`${viewDatesTip.data ? "Edit" : "Add"} Tip`}
              </Button>
            </form>
          </Form>
          <DayPrevNext />
        </div>
      )}
    </div>
  );
};

export default DayView;
