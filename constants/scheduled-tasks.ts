// Helper function to get dates relative to today
const getRelativeDate = (daysFromToday: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)
  return date.toISOString().split("T")[0]
}

export const SCHEDULED_TASKS = [
  {
    title: "Weekly Planning Session",
    description: "Review goals, plan upcoming week, and organize priorities",
    date: getRelativeDate(7), // Next week
  },
  {
    title: "Monthly Budget Review",
    description: "Check expenses, review budget, and plan financial goals",
    date: getRelativeDate(30), // Next month
  },
  {
    title: "Health Check Appointment",
    description: "Schedule and attend regular health checkup",
    date: getRelativeDate(90), // 3 months from now
  },
  {
    title: "Backup Important Files",
    description: "Create backup of important documents and photos",
    date: getRelativeDate(14), // 2 weeks from now
  },
  {
    title: "Deep Clean Living Space",
    description: "Thorough cleaning and organizing of home/workspace",
    date: getRelativeDate(21), // 3 weeks from now
  },
  {
    title: "Review and Update Resume",
    description: "Update resume with recent achievements and skills",
    date: getRelativeDate(60), // 2 months from now
  },
]