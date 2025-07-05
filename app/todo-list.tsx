"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2, Calendar, RotateCcw, CheckCircle2, Clock } from "lucide-react"
import { DAILY_TASKS } from "@/constants/daily-tasks"
import { SCHEDULED_TASKS } from "@/constants/scheduled-tasks"

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

export default function Component() {
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

  const removeDailyTask = (id: string) => {
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

  const removeScheduledTask = (id: string) => {
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
  const dailyProgress = dailyTasks.length > 0 ? (dailyCompleted / dailyTasks.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="bg-THISSHOULDNOTEXIST p-10 text-4xl">
        If Tailwind works, you’ll see a build error.
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Task Manager</h1>
          <p className="text-slate-600">Stay organized and productive</p>
        </div>

        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Daily Tasks ({dailyCompleted}/{dailyTasks.length})
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Scheduled ({scheduledCompleted}/{scheduledTasks.length})
            </TabsTrigger>
          </TabsList>

          {/* Daily Tasks Tab */}
          <TabsContent value="daily">
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-slate-900">Daily Tasks</CardTitle>
                    <p className="text-slate-600 mt-1">Resets every day • Last reset: {lastResetDate}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetDailyTasks} className="gap-2 bg-transparent">
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>

                {/* Progress Section */}
                {dailyTasks.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-medium text-slate-900">{Math.round(dailyProgress)}% Complete</span>
                    </div>
                    <Progress value={dailyProgress} className="h-2" />
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Add new daily task */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a new daily task..."
                    value={newDailyTask}
                    onChange={(e) => setNewDailyTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addDailyTask()}
                    className="flex-1"
                  />
                  <Button onClick={addDailyTask} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>

                <Separator />

                {/* Daily tasks list */}
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {dailyTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`group flex items-center gap-3 p-4 rounded-lg border transition-all hover:shadow-md ${task.completed
                          ? "bg-slate-50 border-slate-200"
                          : "bg-white border-slate-200 hover:border-slate-300"
                          } ${task.isPermanent ? "border-l-4 border-l-blue-500" : ""}`}
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleDailyTask(task.id)}
                          className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <span className={`flex-1 ${task.completed ? "line-through text-slate-500" : "text-slate-900"}`}>
                          {task.text}
                        </span>
                        {task.isPermanent && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            Default
                          </Badge>
                        )}
                        {!task.isPermanent && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDailyTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-slate-400 hover:text-red-500 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduled Tasks Tab */}
          <TabsContent value="scheduled">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-slate-900">Scheduled Tasks</CardTitle>
                <p className="text-slate-600">Plan tasks for specific dates</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Add new scheduled task */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
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
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={newScheduledTask.date}
                      onChange={(e) => setNewScheduledTask({ ...newScheduledTask, date: e.target.value })}
                      className="flex-1"
                    />
                    <Button onClick={addScheduledTask} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Task
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Scheduled tasks list */}
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {sortedScheduledTasks.length === 0 ? (
                      <div className="text-center text-slate-500 py-12">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                        <p>No scheduled tasks yet</p>
                        <p className="text-sm">Add your first task above</p>
                      </div>
                    ) : (
                      sortedScheduledTasks.map((task) => {
                        const overdue = isOverdue(task.date) && !task.completed
                        return (
                          <div
                            key={task.id}
                            className={`group flex items-start gap-3 p-4 rounded-lg border transition-all hover:shadow-md ${task.completed
                              ? "bg-slate-50 border-slate-200"
                              : overdue
                                ? "bg-red-50 border-red-200"
                                : "bg-white border-slate-200 hover:border-slate-300"
                              } ${task.isPermanent ? "border-l-4 border-l-green-500" : ""}`}
                          >
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => toggleScheduledTask(task.id)}
                              className="mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div
                                className={`font-medium ${task.completed ? "line-through text-slate-500" : "text-slate-900"}`}
                              >
                                {task.title}
                              </div>
                              {task.description && (
                                <div
                                  className={`text-sm mt-1 ${task.completed ? "line-through text-slate-400" : "text-slate-600"}`}
                                >
                                  {task.description}
                                </div>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                <span className={`text-sm ${overdue ? "text-red-600 font-medium" : "text-slate-500"}`}>
                                  {formatDate(task.date)}
                                </span>
                                {overdue && (
                                  <Badge variant="destructive" className="text-xs">
                                    Overdue
                                  </Badge>
                                )}
                                {task.isPermanent && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                    Default
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {!task.isPermanent && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeScheduledTask(task.id)}
                                className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-slate-400 hover:text-red-500 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
