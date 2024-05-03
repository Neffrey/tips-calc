// LIBS

import StatCard from "./stat-card";

// CONSTS
const STAT_CARDS = [
  {
    title: "Totals",
    description: "All time stats",
    stats: [
      { title: "$: ", content: "694.20" },
      { title: "Hours: ", content: "420" },
      { title: "Avg / Hour: ", content: "69" },
    ],
    btnText: "All Totals Stats",
  },
  {
    title: "Monthly",
    description: "May 2024",
    stats: [
      { title: "Current Month: ", content: "694.20" },
      { title: "Avg Monthly: ", content: "69" },
      { title: "Hours: ", content: "420" },
      { title: "Avg / Hour: ", content: "69" },
    ],
    btnText: "All Monthly Stats",
  },
  {
    title: "Biweekly",
    description: "4/28 - 5/11",
    stats: [
      { title: "Current Total: ", content: "694.20" },
      { title: "Avg Weekly: ", content: "69" },
      { title: "Hours: ", content: "420" },
      { title: "Avg / Hour: ", content: "69" },
    ],
    btnText: "All Weeks",
  },
  {
    title: "Weekly",
    description: "4/28 - 5/4",
    stats: [
      { title: "Current Week: ", content: "694.20" },
      { title: "Avg Weekly: ", content: "69" },
      { title: "Hours: ", content: "420" },
      { title: "Avg / Hour: ", content: "69" },
    ],
    btnText: "All Weeks",
  },
  {
    title: "Daily",
    description: "Friday May 3rd",
    stats: [
      { title: "Current Day: ", content: "694.20" },
      { title: "Avg Hourly: ", content: "69" },
      { title: "Hours: ", content: "420" },
      { title: "Avg / Hour: ", content: "69" },
    ],
    btnText: "All Days",
  },
  {
    title: "Custom",
    description: "Create your own time range",
    stats: [
      { title: "Total: ", content: "694.20" },
      { title: "Avg Hourly: ", content: "69" },
      { title: "Hours: ", content: "420" },
      { title: "Avg / Hour: ", content: "69" },
    ],
    btnText: "Edit Custom Stats",
  },
];

// COMP
const StatsDashboard = () => {
  return (
    <div className="flex w-1/2 flex-col items-end gap-4">
      <h2 className="center text-2xl font-bold uppercase tracking-widest">
        Stats
      </h2>
      <div className="grid w-full grid-cols-3 gap-3">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
};

export default StatsDashboard;
