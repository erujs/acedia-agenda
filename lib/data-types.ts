export type Schedule = "daily" | "weekdays" | "weekends"

export interface RawTaskData {
  label: string
  schedule: Schedule
}

export interface FilteredTaskData {
  id: string
  label: string
  completed: boolean
}