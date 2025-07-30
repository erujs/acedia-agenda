// Helper function to get dates relative to today
const getRelativeDate = (daysFromToday: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)
  return date.toISOString().split("T")[0]
}

export const SCHEDULED_TASKS = [
  {
    title: "Update Wedding Pictures",
    description: "tag people on wedding pictures and update ig acct",
    date: getRelativeDate(2),
  },
  {
    title: "Dry Clean Suit",
    description: "Dry clean the suit from je&co and ask if they have hanger spare, also check if they are also accepting alters from different clothing brands like uniqlo",
    date: getRelativeDate(2),
  },
  {
    title: "Sort Wife Pics",
    description: "Sort Wife Pics",
    date: getRelativeDate(2),
  },
  {
    title: "Sort Google Drive Pics",
    description: "Sort Google Drive Pics",
    date: getRelativeDate(2),
  },
  {
    title: "Sort Music Videos",
    description: "Sort Music Videos",
    date: getRelativeDate(2),
  },
  {
    title: "Sort Documents",
    description: "Sort Documents",
    date: getRelativeDate(2),
  },
]