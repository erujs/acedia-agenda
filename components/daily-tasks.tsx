"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Circle, CheckCircle2 } from "lucide-react"
import { Schedule, RawTaskData, FilteredTaskData } from "@/lib/data-types"
import { useAPI } from "@/hooks/use-api"
import { DailyTasksSkeleton } from "./skeleton"

function getTodaySchedule(): "weekdays" | "weekends" {
  const day = new Date().getDay()
  return day === 0 || day === 6 ? "weekends" : "weekdays"
}

function isTaskForToday(schedule: Schedule, todaySchedule: "weekdays" | "weekends"): boolean {
  return schedule === "daily" || schedule === todaySchedule
}

export default function TodoPage() {
  const [todayTasks, setTodayTasks] = useState<FilteredTaskData[]>([])
  const [quote, setQuote] = useState<string>("")
  const API_URL = process.env.NEXT_PUBLIC_GULA_ARCANA_URL || "http://localhost:3000";
  const { data: tasks, error, loading } = useAPI<RawTaskData[]>(`${API_URL}/api/tasks`)

  const todaySchedule = getTodaySchedule()

  useEffect(() => {
    if (!tasks) return
    const tasksArray = Array.isArray(tasks) ? tasks : (tasks as any)["tasks"] as RawTaskData[]
    const filteredTodayTasks: FilteredTaskData[] = tasksArray
      .filter((task) => isTaskForToday(task.schedule, todaySchedule))
      .map((task, index) => ({
        id: `task-${index}`,
        label: task.label,
        completed: false,
      }))

    setTodayTasks(filteredTodayTasks)
    setQuote("Progress is just consistent iterations.")
  }, [tasks, todaySchedule])

  const toggleTask = (id: string) => {
    setTodayTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const completedCount = todayTasks.filter((t) => t.completed).length
  const progressPercentage =
    todayTasks.length > 0 ? Math.round((completedCount / todayTasks.length) * 100) : 0

  if (error) {
    throw new Error(error)
  }

  if (loading || !tasks) {
    return <DailyTasksSkeleton />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-foreground">
      <div className="w-full max-w-3xl space-y-6 border-2 !border-muted-foreground rounded-xl">
        <Card className="shadow-sm bg-foreground">
          <CardHeader>
            <div className="flex items-start justify-between text-secondary">
              <CardTitle className="text-xl">Agenda</CardTitle>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {new Date().toLocaleDateString("en-US", { weekday: "long" })}
                </p>
                <p className="text-xs">
                  {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
            <p className="text-sm text-secondary italic">
              <q>{quote}</q>
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Task list */}
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`group flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105
                    ${task.completed
                      ? "bg-muted-foreground hover:bg-teal-100"
                      : "bg-foreground !border-muted-foreground hover:!border-teal-100 hover:shadow-md"
                    }`}
                >
                  <div className="flex-shrink-0">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-teal-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground group-hover:text-teal-100 transition-colors" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`block text-sm font-medium transition-all
                        ${task.completed
                          ? "line-through text-foreground"
                          : "text-secondary"
                        }`}
                    >
                      {task.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress section */}
            {todayTasks.length > 0 && (
              <div className="space-y-3 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-secondary">
                    {completedCount} of {todayTasks?.length} completed
                  </span>
                </div>

                <div className="w-full bg-muted-foreground rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-100 to-teal-400 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="text-center">
                  <span className="text-2xl font-bold text-secondary">
                    {progressPercentage}%
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}