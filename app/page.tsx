"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Calendar, RotateCcw, CheckCircle2, Circle } from "lucide-react"
import { DAILY_TASKS } from "../constants/daily-tasks"
import { SCHEDULED_TASKS } from "../constants/scheduled-tasks"

interface DailyTask {
  id: string
  text: string
  completed: boolean
  isPermanent?: boolean
}

interface ScheduledTask {
  id: string
  title: string
  date: string
  description?: string
  completed: boolean
  isPermanent?: boolean
}

export default function Page() {
  // Daily Tasks State
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([])
  const [newDailyTask, setNewDailyTask] = useState("")
  const [lastResetDate, setLastResetDate] = useState("")

  // Scheduled Tasks State
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([])
  const [newScheduledTask, setNewScheduledTask] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  })

  // Load and setup daily tasks
  useEffect(() => {
    const savedDailyTasks = localStorage.getItem("dailyTasks")
    const savedResetDate = localStorage.getItem("lastResetDate")
    const today = new Date().toDateString()

    // Create default daily tasks
    const defaultTasks: DailyTask[] = DAILY_TASKS.map((task, index) => ({
      id: `daily-${index}`,
      text: task,
      completed: false,
      isPermanent: true,
    }))

    if (savedDailyTasks) {
      const parsedTasks = JSON.parse(savedDailyTasks)
      // Check if it's a new day and reset
      if (savedResetDate !== today) {
        const resetTasks = parsedTasks.map((task: DailyTask) => ({
          ...task,
          completed: false,
        }))
        const allTasks = [...defaultTasks, ...resetTasks]
        setDailyTasks(allTasks)
        setLastResetDate(today)
        localStorage.setItem("dailyTasks", JSON.stringify(resetTasks))
        localStorage.setItem("lastResetDate", today)
      } else {
        const allTasks = [...defaultTasks, ...parsedTasks]
        setDailyTasks(allTasks)
        setLastResetDate(savedResetDate)
      }
    } else {
      setDailyTasks(defaultTasks)
      setLastResetDate(today)
      localStorage.setItem("lastResetDate", today)
    }
  }, [])

  // Load scheduled tasks
  useEffect(() => {
    const savedScheduledTasks = localStorage.getItem("scheduledTasks")
    // Convert default tasks to regular tasks format
    const defaultTasksFormatted: ScheduledTask[] = SCHEDULED_TASKS.map((task, index) => ({
      id: `scheduled-default-${index}`,
      title: task.title,
      date: task.date,
      description: task.description,
      completed: false,
      isPermanent: true,
    }))

    if (savedScheduledTasks) {
      const parsedUserTasks = JSON.parse(savedScheduledTasks)
      const allTasks = [...defaultTasksFormatted, ...parsedUserTasks]
      setScheduledTasks(allTasks)
    } else {
      setScheduledTasks(defaultTasksFormatted)
    }
  }, [])

  // Save daily tasks (only user-added ones)
  useEffect(() => {
    const userTasks = dailyTasks.filter((task) => !task.isPermanent)
    if (userTasks.length > 0) {
      localStorage.setItem("dailyTasks", JSON.stringify(userTasks))
    }
  }, [dailyTasks])

  // Save scheduled tasks (only user-added ones)
  useEffect(() => {
    const userTasks = scheduledTasks.filter((task) => !task.isPermanent)
    if (userTasks.length > 0) {
      localStorage.setItem("scheduledTasks", JSON.stringify(userTasks))
    } else {
      localStorage.removeItem("scheduledTasks")
    }
  }, [scheduledTasks])

  // Daily Tasks Functions
  const addDailyTask = () => {
    if (newDailyTask.trim()) {
      const task: DailyTask = {
        id: Date.now().toString(),
        text: newDailyTask.trim(),
        completed: false,
      }
      setDailyTasks([...dailyTasks, task])
      setNewDailyTask("")
    }
  }

  const toggleDailyTask = (id: string) => {
    setDailyTasks(dailyTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const removeDailyTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the toggle
    const task = dailyTasks.find((t) => t.id === id)
    if (task?.isPermanent) return
    setDailyTasks(dailyTasks.filter((task) => task.id !== id))
  }

  const resetDailyTasks = () => {
    const resetTasks = dailyTasks.map((task) => ({ ...task, completed: false }))
    setDailyTasks(resetTasks)
    const today = new Date().toDateString()
    setLastResetDate(today)
    localStorage.setItem("lastResetDate", today)
  }

  // Scheduled Tasks Functions
  const addScheduledTask = () => {
    if (newScheduledTask.title.trim()) {
      const task: ScheduledTask = {
        id: Date.now().toString(),
        title: newScheduledTask.title.trim(),
        date: newScheduledTask.date,
        description: newScheduledTask.description.trim() || undefined,
        completed: false,
      }
      setScheduledTasks([...scheduledTasks, task])
      setNewScheduledTask({
        title: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      })
    }
  }

  const toggleScheduledTask = (id: string) => {
    setScheduledTasks(scheduledTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const removeScheduledTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the toggle
    const taskToRemove = scheduledTasks.find((task) => task.id === id)
    if (taskToRemove?.isPermanent) {
      return // Don't allow deletion of permanent tasks
    }
    setScheduledTasks(scheduledTasks.filter((task) => task.id !== id))
  }

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const isOverdue = (dateString: string) => {
    const taskDate = new Date(dateString)
    taskDate.setHours(23, 59) // End of day
    return taskDate < new Date()
  }

  // Sort scheduled tasks
  const sortedScheduledTasks = scheduledTasks.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateA.getTime() - dateB.getTime()
  })

  const dailyCompleted = dailyTasks.filter((t) => t.completed).length
  const scheduledCompleted = scheduledTasks.filter((t) => t.completed).length

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12 cursor-pointer">
          <TabsTrigger value="daily" className="text-sm font-medium cursor-pointer hover:bg-muted/80 transition-colors">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4" />
              Daily Tasks
              <Badge variant="secondary" className="ml-1">
                {dailyCompleted}/{dailyTasks.length}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="scheduled"
            className="text-sm font-medium cursor-pointer hover:bg-muted/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduled
              <Badge variant="secondary" className="ml-1">
                {scheduledCompleted}/{scheduledTasks.length}
              </Badge>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Daily Tasks Tab */}
        <TabsContent value="daily" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Daily Tasks</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Resets every day • Last reset: {lastResetDate}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetDailyTasks}
                  className="gap-2 bg-transparent cursor-pointer hover:bg-muted hover:text-foreground transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add new daily task */}
              <div className="flex gap-3">
                <Input
                  placeholder="Add a new daily task..."
                  value={newDailyTask}
                  onChange={(e) => setNewDailyTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addDailyTask()}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={addDailyTask}
                  className="gap-2 px-6 cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {/* Daily tasks list */}
              <div className="space-y-3">
                {dailyTasks.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No daily tasks yet. Add one above!</p>
                  </div>
                ) : (
                  dailyTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleDailyTask(task.id)}
                      className={`group flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                        task.completed
                          ? "bg-green-50 border-green-200 hover:border-green-300 hover:bg-green-100 text-black"
                          : "bg-background border-border hover:border-primary/50 hover:shadow-md hover:bg-muted/30"
                      } ${task.isPermanent ? "border-l-4 border-l-blue-500" : ""}`}
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
                          className={`block text-sm font-medium transition-all ${
                            task.completed
                              ? "line-through text-muted-foreground"
                              : "text-foreground group-hover:text-primary"
                          }`}
                        >
                          {task.text}
                        </span>
                        {task.isPermanent && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Default Task
                          </Badge>
                        )}
                      </div>
                      {!task.isPermanent && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => removeDailyTask(task.id, e)}
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Progress section */}
              {dailyTasks.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Daily Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {dailyCompleted} of {dailyTasks.length} completed
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(dailyCompleted / dailyTasks.length) * 100}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-primary">
                      {Math.round((dailyCompleted / dailyTasks.length) * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Tasks Tab */}
        <TabsContent value="scheduled" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Scheduled Tasks</CardTitle>
              <p className="text-sm text-muted-foreground">Plan tasks for specific dates</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add new scheduled task */}
              <div className="space-y-3 p-4 bg-muted/30 rounded-xl">
                <Input
                  placeholder="Task title..."
                  value={newScheduledTask.title}
                  onChange={(e) => setNewScheduledTask({ ...newScheduledTask, title: e.target.value })}
                />
                <Input
                  placeholder="Description (optional)..."
                  value={newScheduledTask.description}
                  onChange={(e) => setNewScheduledTask({ ...newScheduledTask, description: e.target.value })}
                />
                <div className="flex gap-3">
                  <Input
                    type="date"
                    value={newScheduledTask.date}
                    onChange={(e) => setNewScheduledTask({ ...newScheduledTask, date: e.target.value })}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={addScheduledTask}
                    className="gap-2 px-6 cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              </div>

              {/* Scheduled tasks list */}
              <div className="space-y-3">
                {sortedScheduledTasks.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No scheduled tasks yet. Create one above!</p>
                  </div>
                ) : (
                  sortedScheduledTasks.map((task) => {
                    const overdue = isOverdue(task.date) && !task.completed
                    return (
                      <div
                        key={task.id}
                        onClick={() => toggleScheduledTask(task.id)}
                        className={`group flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                          task.completed
                            ? "bg-green-50 border-green-200 hover:border-green-300 hover:bg-green-100 text-black"
                            : overdue
                              ? "bg-red-50 border-red-200 hover:border-red-300 hover:bg-red-100"
                              : "bg-background border-border hover:border-primary/50 hover:shadow-md hover:bg-muted/30"
                        } ${task.isPermanent ? "border-l-4 border-l-green-500" : ""}`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {task.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-medium transition-all ${
                                task.completed
                                  ? "line-through text-muted-foreground"
                                  : "text-foreground group-hover:text-primary"
                              }`}
                            >
                              {task.title}
                            </span>
                            {task.isPermanent && (
                              <Badge variant="outline" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                          {task.description && (
                            <p className={`text-sm text-muted-foreground ${task.completed ? "line-through" : ""}`}>
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span className={overdue ? "text-red-600 font-medium" : "text-muted-foreground"}>
                                {formatDate(task.date)}
                              </span>
                            </div>
                            {overdue && (
                              <Badge variant="destructive" className="text-xs">
                                Overdue
                              </Badge>
                            )}
                          </div>
                        </div>
                        {!task.isPermanent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => removeScheduledTask(task.id, e)}
                            className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
