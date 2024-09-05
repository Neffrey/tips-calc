// LIBS
import z from "zod";

// UTILS
// COMPONENTS
import { Input } from "~/components/ui/input";

// CONSTANTS
export const addBaseWageFormSchema = z.object({
  amount: z
    .number({ message: "Base hourly wage must be a positive number" })
    .positive()
    .transform((val) => val.toString()),
  date: z
    .number()
    .positive()
    .int()
    .transform((val) => val.toString()), // Date in epoch
});

export const editBaseWageFormSchema = z.object({
  id: z.string(),
  amount: z
    .number({ message: "Base hourly wage must be a positive number" })
    .positive()
    .transform((val) => val.toString()),
  date: z
    .number()
    .positive()
    .int()
    .transform((val) => val.toString()), // Date in epoch
});

// COMP
const BaseWageForm = () => {
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
  //   const form = useForm<z.infer<typeof addTipFormSchema>>({
  //     resolver: zodResolver(addTipFormSchema),
  //     defaultValues: {
  //       hours: viewDatesTip?.hours.toString() ?? "0",
  //       cardTip: viewDatesTip?.cardTip.toString() ?? "0",
  //       cashDrawerStart: viewDatesTip?.cashDrawerStart?.toString() ?? "0",
  //       cashDrawerEnd: viewDatesTip?.toString() ?? "0",
  //     },
  //   });

  //   const handleSubmit = (values: z.infer<typeof addTipFormSchema>) => {
  //     const validatedValues = {
  //       hours: values.hours,
  //       cardTip: values.cardTip,
  //       cashDrawerStart: values.cashDrawerStart,
  //       cashDrawerEnd: values.cashDrawerEnd,
  //       date: viewDate,
  //     };
  //     viewDatesTip
  //       ? editTip.mutate(validatedValues)
  //       : createTip.mutate(validatedValues);
  //   };
  return (
    <div>
      <Input id="basepay" type="number" />

      {/* <Form {...form}>
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
              </div> */}

      {/* cashDrawer section */}
      {/* <div className="flex items-center gap-3 pt-1">
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
              )} */}

      {/* bottom section */}
      {/* <Button
                type="submit"
                className="rounded-xl px-8 py-6 text-xl font-bold"
              >
                {`${viewDatesTip ? "Edit" : "Add"} Tip`}
              </Button>
            </form>
          </Form> */}
    </div>
  );
};

export default BaseWageForm;
