// LIBS
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaCheck,
  FaDollarSign,
  FaExclamationCircle,
  FaRegClock,
} from "react-icons/fa";
import { z } from "zod";

// HELPERS
import useDataStore, { type Tip } from "~/components/stores/data-store";
import useThemeStore from "~/components/stores/theme-store";
import { getDaysDifference } from "~/lib/time-date";
import { cn, twoDecimals } from "~/lib/utils";
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
import DayControlBtns from "./day-control-btns";

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

  const [viewDatesTip, setViewDatesTip] = useState<Tip | undefined | null>(
    tips?.find((tip) => tip.date.getTime() === viewDate.getTime()),
  );

  // QUERIES
  const tipsQuery = api.tip.findAll.useQuery();

  const createTip = api.tip.create.useMutation({
    onSuccess: () => {
      void tipsQuery.refetch();
      setViewDatesTip(
        tipsQuery.data?.find(
          (tip) => tip.date.getTime() === viewDate.getTime(),
        ),
      );
    },
  });

  const editTip = api.tip.edit.useMutation({
    onSuccess: () => {
      void tipsQuery.refetch();
      setViewDatesTip(
        tipsQuery.data?.find(
          (tip) => tip.date.getTime() === viewDate.getTime(),
        ),
      );
    },
  });

  // FORM
  const form = useForm<z.infer<typeof addTipFormSchema>>({
    resolver: zodResolver(addTipFormSchema),
    defaultValues: {
      hours: viewDatesTip?.hours ? viewDatesTip.hours.toString() : "0",
      amount: viewDatesTip?.amount ? viewDatesTip.amount.toString() : "0",
      cashDrawerStart: viewDatesTip?.cashDrawerStart
        ? viewDatesTip.cashDrawerStart.toString()
        : "0",
      cashDrawerEnd: viewDatesTip?.cashDrawerEnd
        ? viewDatesTip.cashDrawerEnd.toString()
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
    viewDatesTip
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
    if (!viewDatesTip) {
      return 0;
    }
    return twoDecimals(
      Number(viewDatesTip?.amount ? viewDatesTip.amount : 0) +
        Number(viewDatesTip?.cashDrawerEnd ? viewDatesTip.cashDrawerEnd : 0) -
        Number(
          viewDatesTip?.cashDrawerStart ? viewDatesTip.cashDrawerStart : 0,
        ),
    );
  };

  // UI STATES
  const [viewDatesTotalMoney, setViewDatesTotalMoney] =
    useState<number>(calcViewDatesStats());

  // Update UI States
  useLayoutEffect(
    () => {
      setViewDatesTip(
        tips?.find((tip) => tip.date.getTime() === viewDate.getTime()),
      );
      setViewDatesTotalMoney(calcViewDatesStats());
    },
    // eslint-disable-next-line -- only want dependency on data
    [viewDatesTip, tips, tipsQuery.data, viewDate],
  );

  // SET FORM VALUES ON DATA CHANGE
  useLayoutEffect(
    () => {
      if (!viewDatesTip) {
        form.setValue("amount", "0");
        form.setValue("hours", "0");
        form.setValue("cashDrawerStart", "0");
        form.setValue("cashDrawerEnd", "0");
      }
      if (viewDatesTip) {
        form.setValue("amount", viewDatesTip.amount.toString());
        form.setValue("hours", viewDatesTip.hours.toString());
        if (viewDatesTip.cashDrawerStart) {
          form.setValue(
            "cashDrawerStart",
            viewDatesTip.cashDrawerStart.toString(),
          );
        } else {
          form.setValue("cashDrawerStart", "0");
        }
        if (viewDatesTip.cashDrawerEnd) {
          form.setValue("cashDrawerEnd", viewDatesTip.cashDrawerEnd.toString());
        }
        // Show cash drawer if either start or end is not 0
        if (
          (viewDatesTip.cashDrawerStart &&
            viewDatesTip.cashDrawerStart !== 0) ??
          (viewDatesTip.cashDrawerEnd && viewDatesTip.cashDrawerEnd !== 0)
          // TODO: Keep open if profile default is cashDrawerOpen
        ) {
          setCashDrawer(true);
        } else {
          setCashDrawer(false);
        }
      }
    },

    // eslint-disable-next-line -- only want dependency on data
    [viewDatesTip, viewDate],
  );

  // RETURN COMPONENT
  return (
    <div className="flex flex-col gap-4">
      {
        <div className="flex w-full flex-col items-center justify-between gap-2 rounded-lg bg-card px-4 py-3">
          <DayControlBtns />
          <div
            className={cn(
              "flex flex-wrap justify-between gap-3 rounded-lg bg-popover px-6 py-5 text-popover-foreground",
              viewDatesTip ? "" : "cursor-not-allowed",
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
              {viewDatesTip ? "Tip Entered" : "No Tip Data"}
              <div className="pl-3" />
              {viewDatesTip ? (
                <FaCheck className="text-primary" />
              ) : (
                <FaExclamationCircle className="text-accent" />
              )}
            </div>
            <div
              className={cn(
                "flex w-full",
                viewDatesTip
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
                    {viewDatesTip?.hours
                      ? twoDecimals(viewDatesTip.hours).toString()
                      : "0"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span>$ per H</span>
                  <span>
                    {viewDatesTotalMoney && viewDatesTip?.hours
                      ? twoDecimals(
                          viewDatesTotalMoney / viewDatesTip?.hours,
                        ).toString()
                      : "0"}
                  </span>
                </div>
              </div>
            </div>
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
                {`${viewDatesTip ? "Edit Existing" : "Add"} Tip`}
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
                {`${viewDatesTip ? "Edit" : "Add"} Tip`}
              </Button>
            </form>
          </Form>
        </div>
      }
    </div>
  );
};

export default DayView;
