"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Circle, CheckCircle2 } from "lucide-react"
import data from "@/lib/data/tasks.json"
import { Schedule, RawTaskData, FilteredTaskData } from "@/lib/data-types"

function getTodaySchedule(): "weekdays" | "weekends" {
  const day = new Date().getDay()
  return day === 0 || day === 6 ? "weekends" : "weekdays"
}

function isTaskForToday(schedule: Schedule, todaySchedule: "weekdays" | "weekends"): boolean {
  return schedule === "daily" || schedule === todaySchedule
}

export default function TodoPage() {
  const [tasks, setTasks] = useState<FilteredTaskData[]>([])
  const [quote, setQuote] = useState<string>("Loading inspiration...")

  const todaySchedule = getTodaySchedule()

  useEffect(() => {
    const todayTasks: FilteredTaskData[] = (data["tasks"] as RawTaskData[])
      .filter((task) => isTaskForToday(task.schedule, todaySchedule))
      .map((task, index) => ({
        id: `task-${index}`,
        label: task.label,
        completed: false,
      }))

    setTasks(todayTasks)
    setQuote("Progress is just consistent iterations.")
  }, [])

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const completedCount = tasks.filter((t) => t.completed).length
  const progressPercentage =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">Agenda</CardTitle>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {new Date().toLocaleDateString("en-US", { weekday: "long" })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1 italic">
              <q>{quote}</q>
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Task list */}
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`group flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${task.completed
                    ? "bg-teal-50 border-teal-200 hover:border-teal-300 hover:bg-teal-100 text-black"
                    : "bg-background border-border hover:border-primary/50 hover:shadow-md hover:bg-muted/30"
                    }`}
                >
                  <div className="flex-shrink-0">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`block text-sm font-medium transition-all ${task.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground group-hover:text-primary"
                        }`}
                    >
                      {task.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress section */}
            {tasks.length > 0 && (
              <div className="space-y-3 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {completedCount} of {tasks.length} completed
                  </span>
                </div>

                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-teal-400 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="text-center">
                  <span className="text-2xl font-bold text-primary">
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