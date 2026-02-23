"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Circle, CheckCircle2 } from "lucide-react"
import data from "@/lib/data/daily-tasks.json"
import { DailyTask } from "@/lib/data-types"

export default function TodoPage() {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [quote, setQuote] = useState<string>("Loading inspiration...")

  useEffect(() => {
    // Initialize default daily tasks
    const defaultTasks: DailyTask[] = data["daily-tasks"].map((task, index) => ({
      id: `daily-${index}`,
      text: task,
      completed: false,
    }))
    setDailyTasks(defaultTasks)

    // Fetch motivational quote
    const fetchQuote = async () => {
      try {
        const res = await fetch("https://api.quotable.io/random")
        const result = await res.json()
        setQuote(`${result.content} — ${result.author}`)
      } catch (error) {
        setQuote("Small steps every day lead to big results.")
      }
    }

    fetchQuote()
  }, [])

  const toggleDailyTask = (id: string) => {
    setDailyTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const dailyCompleted = dailyTasks.filter((t) => t.completed).length
  const progressPercentage =
    dailyTasks.length > 0
      ? Math.round((dailyCompleted / dailyTasks.length) * 100)
      : 0

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-6">
        <Tabs defaultValue="daily" className="space-y-6">
          <TabsContent value="daily" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Agenda</CardTitle>
                <p className="text-sm text-muted-foreground mt-1 italic">
                  <q>{quote}</q>
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Daily tasks list */}
                <div className="space-y-3">
                  {dailyTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleDailyTask(task.id)}
                      className={`group flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${task.completed
                          ? "bg-green-50 border-green-200 hover:border-green-300 hover:bg-green-100 text-black"
                          : "bg-background border-border hover:border-primary/50 hover:shadow-md hover:bg-muted/30"
                        }`}
                    >
                      <div className="flex-shrink-0">
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
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
                          {task.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress section */}
                {dailyTasks.length > 0 && (
                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Progress
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {dailyCompleted} of {dailyTasks.length} completed
                      </span>
                    </div>

                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}