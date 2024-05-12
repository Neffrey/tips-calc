// COMP
const DayEnterTip = ({ date }: { date: Date }) => {
  return (
    <div className="flex w-full justify-between gap-2">
      Enter {date.toLocaleDateString()} tip data
    </div>
  );
};

export default DayEnterTip;
