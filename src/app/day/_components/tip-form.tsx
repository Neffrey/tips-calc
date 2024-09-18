// LIBS
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// UTILS
import { api } from "~/trpc/react";

// COMPONENTS
import useDataStore from "~/components/stores/data-store";
import useThemeStore from "~/components/stores/theme-store";
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

// CONSTANTS
export const addTipFormSchema = z.object({
  hours: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: "Hourly must be a number",
  }),
  cardTip: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: "Hourly must be a number",
  }),
  cashDrawerStart: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: "Hourly must be a number",
  }),
  cashDrawerEnd: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: "Hourly must be a number",
  }),
});

const TipForm = () => {
  const cashDrawer = useThemeStore((state) => state.cashDrawer);
  const setCashDrawer = useThemeStore((state) => state.setCashDrawer);

  const viewDate = useDataStore((state) => state.viewDate);
  const viewDatesTip = useDataStore((state) => state.viewDatesTip);
  const setViewDatesTip = useDataStore((state) => state.setViewDatesTip);

  // Tip Data
  const tips = api.tip.findAll.useQuery();

  const createTip = api.tip.create.useMutation({
    onSuccess: () => {
      void tips.refetch();
      setViewDatesTip(
        tips.data?.find((tip) => tip.date.getTime() === viewDate.getTime()),
      );
    },
  });

  const editTip = api.tip.edit.useMutation({
    onSuccess: () => {
      void tips.refetch();
      setViewDatesTip(
        tips.data?.find((tip) => tip.date.getTime() === viewDate.getTime()),
      );
    },
  });

  // FORM
  const form = useForm<z.infer<typeof addTipFormSchema>>({
    resolver: zodResolver(addTipFormSchema),
    defaultValues: {
      hours: viewDatesTip?.hours.toString() ?? "0",
      cardTip: viewDatesTip?.cardTip.toString() ?? "0",
      cashDrawerStart: viewDatesTip?.cashDrawerStart?.toString() ?? "0",
      cashDrawerEnd: viewDatesTip?.cashDrawerEnd?.toString() ?? "0",
    },
  });

  // SUBMIT
  const handleSubmit = (values: z.infer<typeof addTipFormSchema>) => {
    const validatedValues = {
      hours: values.hours,
      cardTip: values.cardTip,
      cashDrawerStart: values.cashDrawerStart,
      cashDrawerEnd: values.cashDrawerEnd,
      date: viewDate,
    };
    viewDatesTip
      ? editTip.mutate(validatedValues)
      : createTip.mutate(validatedValues);
  };

  // Keep ViewDatesTip Updated
  useLayoutEffect(() => {
    setViewDatesTip(
      tips?.data?.find((tip) => tip.date.getTime() === viewDate.getTime()),
    );
  }, [viewDatesTip, tips.data, viewDate, setViewDatesTip]);

  // SET FORM VALUES ON DATA CHANGE
  useLayoutEffect(
    () => {
      if (!viewDatesTip) {
        form.setValue("cardTip", "0");
        form.setValue("hours", "0");
        form.setValue("cashDrawerStart", "0");
        form.setValue("cashDrawerEnd", "0");
      }
      if (viewDatesTip) {
        form.setValue("cardTip", viewDatesTip.cardTip.toString());
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
            name="cardTip"
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
                    <FormLabel className="text-md">$ Cash Drawer End</FormLabel>
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
  );
};

export default TipForm;
