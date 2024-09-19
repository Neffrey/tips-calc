// LIBS
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

// UTILS
import useDataStore from "~/components/stores/data-store";
// import { api } from "~/trpc/react";

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
  amount: z.string().refine((val) => !Number.isNaN(Number(val)), {
    message: "Hourly base wage must be a positive number",
  }),
});

// COMP
const BaseWageForm = () => {
  // STATE
  const viewDate = useDataStore((state) => state.viewDate);
  const viewDatesBaseWage = useDataStore((state) => state.viewDatesBaseWage);
  const setViewDatesBaseWage = useDataStore(
    (state) => state.setViewDatesBaseWage,
  );

  // API
  // const baseWageData = api.baseWage.findAll.useQuery();

  // const createBaseWage = api.baseWage.create.useMutation({
  //   onSuccess: () => {
  //     void baseWageData.refetch();
  //     setViewDatesBaseWage(
  //       baseWageData.data?.find(
  //         (data) => data.date.getTime() === viewDate.getTime(),
  //       ),
  //     );
  //   },
  // });

  // const editBaseWage = api.baseWage.edit.useMutation({
  //   onSuccess: () => {
  //     void baseWageData.refetch();
  //     setViewDatesBaseWage(
  //       baseWageData.data?.find(
  //         (data) => data.date.getTime() === viewDate.getTime(),
  //       ),
  //     );
  //   },
  // });

  // FORM
  const form = useForm<z.infer<typeof baseWageFormSchema>>({
    resolver: zodResolver(baseWageFormSchema),
    defaultValues: {
      amount: viewDatesBaseWage?.amount.toString() ?? "0",
    },
  });

  const handleSubmit = (values: z.infer<typeof baseWageFormSchema>) => {
    const validatedValues = {
      amount: values.amount,
    };
    // if (!viewDatesBaseWage) {
    // createBaseWage.mutate({
    //   date: viewDate,
    //   amount: Number(validatedValues?.amount),
    // });
    // }
    // if (viewDatesBaseWage)
    //   editBaseWage.mutate({
    //     id: viewDatesBaseWage.id,
    //     date: viewDatesBaseWage.date,
    //     amount: Number(validatedValues?.amount),
    //   });
  };

  // Keep ViewDatesBaseWage Updated
  // useLayoutEffect(() => {
  //   setViewDatesBaseWage(
  //     baseWageData?.data?.find(
  //       (data) => data.date.getTime() === viewDate.getTime(),
  //     ),
  //   );
  // }, [viewDatesBaseWage, baseWageData.data, viewDate, setViewDatesBaseWage]);

  // SET FORM VALUES ON DATA CHANGE
  useLayoutEffect(
    () => {
      if (!viewDatesBaseWage) {
        form.setValue("amount", "0");
      }
      if (viewDatesBaseWage) {
        form.setValue("amount", viewDatesBaseWage.amount.toString());
      }
    },

    // eslint-disable-next-line -- only want dependency on data
    [viewDatesBaseWage, viewDate],
  );

  // JSX
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full flex-col gap-4 p-6"
      >
        <h3 className="text-lg font-bold">
          {`${viewDatesBaseWage ? "Edit Existing" : "Add"} Base Wage`}
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
        </div>

        {/* bottom section */}
        <Button
          type="submit"
          className="rounded-xl px-8 py-6 text-xl font-bold"
        >
          {`${viewDatesBaseWage ? "Edit" : "Add"} Base Wage`}
        </Button>
      </form>
    </Form>
  );
};

export default BaseWageForm;
