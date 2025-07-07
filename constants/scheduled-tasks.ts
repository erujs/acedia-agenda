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
    title: "Fold clothes",
    description: "Fold my clothes",
    date: getRelativeDate(5),
  },
  {
    title: "APE",
    description: "Schedule and attend regular health checkup",
    date: getRelativeDate(15),
  },
  {
    title: "Post Wedding Pictures",
    description: "Filter and upload wedding pictures to fb and ig",
    date: getRelativeDate(2),
  },
]