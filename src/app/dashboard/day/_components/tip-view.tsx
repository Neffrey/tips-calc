// LIBS
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

// HELPERS
import useTimeStore from "~/components/stores/time-store";
import useThemeStore from "~/components/stores/theme-store";
import { api } from "~/trpc/react";

// COMPONENTS
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import type { Tip } from "~/server/db/schema";

// CONSTANTS
export const addTipFormSchema = z.object({
  hours: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: "Hourly must be a number",
  }),
  amount: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: "Hourly must be a number",
  }),
  date: z.date(),
  cashDrawerStart: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: "Hourly must be a number",
  }),
  cashDrawerEnd: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: "Hourly must be a number",
  }),
});

// COMP
const TipView = ({ data }: { data: Tip | undefined | null }) => {
  // const { toast } = useToast();
  const router = useRouter();

  const cashDrawer = useThemeStore((state) => state.cashDrawer);
  const setCashDrawer = useThemeStore((state) => state.setCashDrawer);
  const currentViewDate = useTimeStore((state) => state.currentViewDate);

  const createTip = api.tip.create.useMutation({
    onSuccess: () => {
      router.refresh();
      form.reset();
    },
  });

  // FORM
  const form = useForm<z.infer<typeof addTipFormSchema>>({
    resolver: zodResolver(addTipFormSchema),
    defaultValues: {
      hours: data?.hours ? data.hours : "0",
      amount: data?.amount ? data.amount : "0",
      cashDrawerStart: data?.cashDrawerStart ? data.cashDrawerStart : "0",
      cashDrawerEnd: data?.cashDrawerEnd ? data.cashDrawerEnd : "0",
      date: currentViewDate,
    },
  });
  const handleSubmit = (values: z.infer<typeof addTipFormSchema>) => {
    const validatedValues = {
      hours: values.hours,
      amount: values.amount,
      date: values.date,
      cashDrawerStart: values.cashDrawerStart,
      cashDrawerEnd: values.cashDrawerEnd,
    };
    createTip.mutate(validatedValues);
    // setOpen(false);
    // toast({
    //   action: (
    //     <DivedToast type="success">
    //       {`Task "${validatedValues.title}" created successfully!`}
    //     </DivedToast>
    //   ),
    // });
  };

  // SET FORM VALUES ON DATA CHANGE
  useEffect(
    () => {
      if (data) {
        form.setValue("amount", data.amount);
        form.setValue("hours", data.hours);
        if (data.cashDrawerStart) {
          form.setValue("cashDrawerStart", data.cashDrawerStart);
        }
        if (data.cashDrawerEnd) {
          form.setValue("cashDrawerEnd", data.cashDrawerEnd);
        }
        // Show cash drawer if either start or end is not 0
        if (
          // cashDrawerDefault ??
          (data.cashDrawerStart && data.cashDrawerStart !== "0") ??
          (data.cashDrawerEnd && data.cashDrawerEnd !== "0")
        ) {
          setCashDrawer(true);
        }
      } else {
        form.setValue("amount", "0");
        form.setValue("hours", "0");
        form.setValue("cashDrawerStart", "0");
        form.setValue("cashDrawerEnd", "0");
      }
    },

    // eslint-disable-next-line -- only want dependency on data
    [data],
  );

  const handleCashDrawer = (input: boolean) => {
    console.log("cashDrawer input: ", input);
    setCashDrawer(!input);
  };

  return (
    // <div className="flex w-full flex-wrap justify-between gap-2">
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
        <div className="flex w-full justify-between gap-3">
          <div className="flex items-center gap-3">
            <Checkbox
              name="cashDrawerToggle"
              checked={cashDrawer}
              onCheckedChange={() => handleCashDrawer(cashDrawer)}
            />
            <label htmlFor="cashDrawerToggle">Cash Drawer</label>
          </div>
          <div className="flex flex-col items-end justify-end p-4">
            {currentViewDate.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
        <Button
          type="submit"
          className="rounded-xl px-8 py-6 text-xl font-bold"
        >
          Add Tip
        </Button>
      </form>
    </Form>
    // </div>
  );
};

export default TipView;
