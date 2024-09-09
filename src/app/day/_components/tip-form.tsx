// LIBS
import { zodResolver } from "@hookform/resolvers/zod";
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// UTILS
import { type Tip } from "~/server/db/schema";
import { api } from "~/trpc/react";

// COMPONENTS
import useDataStore from "~/components/stores/data-store";
import useThemeStore from "~/components/stores/theme-store";

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

  const currentDate = useDataStore((state) => state.currentDate);
  const viewDate = useDataStore((state) => state.viewDate);

  // Tip Data
  const tips = api.tip.findAll.useQuery();
  const [viewDatesTip, setViewDatesTip] = useState<Tip | undefined | null>(
    tips?.data?.find((tip) => tip.date.getTime() === viewDate.getTime()),
  );

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
      cashDrawerEnd: viewDatesTip?.toString() ?? "0",
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
  }, [viewDatesTip, tips.data, viewDate]);

  // Update UI States
  useLayoutEffect(
    () => {
      setViewDatesTip(
        tips?.data?.find((tip) => tip.date.getTime() === viewDate.getTime()),
      );
    },
    // eslint-disable-next-line -- only want dependency on data
    [viewDatesTip, tips.data, viewDate],
  );

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
  return <></>;
};

export default TipForm;
