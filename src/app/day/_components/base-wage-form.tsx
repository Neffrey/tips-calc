// LIBS
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

// UTILS
import { type BaseWage } from "~/server/db/schema";

// COMPONENTS
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

// CONSTANTS
export const baseWageFormSchema = z.object({
  id: z.string().nullable(),
  amount: z
    .number({ message: "Base hourly wage must be a positive number" })
    .positive()
    .transform((val) => val.toString()),
  date: z
    .number()
    .int()
    .refine((val) => val >= 0, { message: "Date must be a valid date" })
    .transform((val) => val.toString()), // Date in epoch
});

// COMP
const BaseWageForm = () => {
  // STATE
  const [currentBaseWage, setCurrentBaseWage] = useState<BaseWage | undefined>(
    undefined,
  );
  // API
  //   const tips = api.tip.findAll.useQuery();
  //   const [viewDatesTip, setViewDatesTip] = useState<Tip | undefined | null>(
  //     tips?.data?.find((tip) => tip.date.getTime() === viewDate.getTime()),
  //   );

  //   const createTip = api.tip.create.useMutation({
  //     onSuccess: () => {
  //       void tips.refetch();
  //       setViewDatesTip(
  //         tips.data?.find((tip) => tip.date.getTime() === viewDate.getTime()),
  //       );
  //     },
  //   });

  //   const editTip = api.tip.edit.useMutation({
  //     onSuccess: () => {
  //       void tips.refetch();
  //       setViewDatesTip(
  //         tips.data?.find((tip) => tip.date.getTime() === viewDate.getTime()),
  //       );
  //     },
  //   });

  // FORM
  const form = useForm<z.infer<typeof baseWageFormSchema>>({
    resolver: zodResolver(baseWageFormSchema),
    defaultValues: {
      id: currentBaseWage?.id ?? null,
      amount: currentBaseWage?.amount.toString() ?? "0",
      date: currentBaseWage?.date.toString() ?? new Date().getTime().toString(),
    },
  });

  const handleSubmit = (values: z.infer<typeof baseWageFormSchema>) => {
    const validatedValues = {
      id: values.id,
      amount: values.amount,
      date: values.date,
    };
    //     viewDatesTip
    //       ? editTip.mutate(validatedValues)
    //       : createTip.mutate(validatedValues);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full flex-col gap-4 p-6"
      >
        <h3 className="text-lg font-bold">
          {`${currentBaseWage ? "Edit Existing" : "Add"} Base Wage`}
        </h3>
        <div className="flex w-full justify-between gap-3">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-md">$ per hour</FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="bwDate" className="text-md">
                  Date Effective
                </FormLabel>
                <FormControl>
                  <div>bwDate input</div>
                  {/* <Input id="bwDate" placeholder="0" {...field} /> */}
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* bottom section */}
        <Button
          type="submit"
          className="rounded-xl px-8 py-6 text-xl font-bold"
        >
          {`${currentBaseWage ? "Edit" : "Add"} Base Wage`}
        </Button>
      </form>
    </Form>
  );
};

export default BaseWageForm;
