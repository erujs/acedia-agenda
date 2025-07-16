// Helper function to get dates relative to today
const getRelativeDate = (daysFromToday: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)
  return date.toISOString().split("T")[0]
}

export const SCHEDULED_TASKS = [
  {
    title: "Workstation Cleanup",
    description: "Clean desktop table and pheriperals",
    date: getRelativeDate(5),
  },
  {
    title: "APE",
    description: "Schedule and attend regular health checkup",
    date: getRelativeDate(15),
  },
  {
    title: "Post Wedding Pictures",
    description: "tag people",
    date: getRelativeDate(2),
  },
  {
    title: "Clean Kitchen",
    description: "Clean Kitchen",
    date: getRelativeDate(2),
  },
    {
    title: "Dry Clean Suit",
    description: "Dry clean the suit from je&co and ask if they have hanger spare, also check if they are also accepting alters from different clothing brands like uniqlo",
    date: getRelativeDate(2),
  },
]