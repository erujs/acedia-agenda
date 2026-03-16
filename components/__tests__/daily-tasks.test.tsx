import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import TodoPage from "../daily-tasks"
import * as useAPIModule from "@/hooks/use-api"

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("@/hooks/use-api")

const mockTasks = [
  { label: "Morning run", schedule: "daily" },
  { label: "Team standup", schedule: "weekdays" },
  { label: "Grocery shopping", schedule: "weekends" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockUseAPI(overrides: Partial<ReturnType<typeof useAPIModule.useAPI>>) {
  jest.spyOn(useAPIModule, "useAPI").mockReturnValue({
    data: null,
    error: null,
    loading: false,
    ...overrides,
  } as any)
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("TodoPage", () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ── Loading state ──────────────────────────────────────────────────────────

  describe("loading state", () => {
    it("renders the skeleton while loading", () => {
      mockUseAPI({ loading: true, data: null })
      render(<TodoPage />)
      expect(screen.getByTestId("skeleton")).toBeInTheDocument()
    })

    it("renders the skeleton when data is null but not erroring", () => {
      mockUseAPI({ loading: false, data: null })
      render(<TodoPage />)
      expect(screen.getByTestId("skeleton")).toBeInTheDocument()
    })
  })

  // ── Error state ────────────────────────────────────────────────────────────

  describe("error state", () => {
    it("throws an error when the API returns an error", () => {
      mockUseAPI({ error: "Network error", data: null })
      const spy = jest.spyOn(console, "error").mockImplementation(() => {})
      expect(() => render(<TodoPage />)).toThrow("Network error")
      spy.mockRestore()
    })
  })

  // ── Rendered content ───────────────────────────────────────────────────────

  describe("rendered content", () => {
    it("displays the Agenda heading", () => {
      mockUseAPI({ data: mockTasks, loading: false })
      render(<TodoPage />)
      expect(screen.getByText("Agenda")).toBeInTheDocument()
    })

    it("displays today's date", () => {
      mockUseAPI({ data: mockTasks, loading: false })
      render(<TodoPage />)
      const today = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      expect(screen.getByText(today)).toBeInTheDocument()
    })

    it("displays the motivational quote", () => {
      mockUseAPI({ data: mockTasks, loading: false })
      render(<TodoPage />)
      expect(
        screen.getByText("Progress is just consistent iterations.")
      ).toBeInTheDocument()
    })

    it("renders tasks wrapped in an object with a tasks key", () => {
      mockUseAPI({ data: { tasks: mockTasks } as any, loading: false })
      render(<TodoPage />)
      expect(screen.getByText("Morning run")).toBeInTheDocument()
    })
  })

  // ── Task scheduling ────────────────────────────────────────────────────────

  describe("task scheduling", () => {
    it("always shows daily tasks regardless of the day", () => {
      mockUseAPI({ data: mockTasks, loading: false })
      render(<TodoPage />)
      expect(screen.getByText("Morning run")).toBeInTheDocument()
    })

    it("shows weekday tasks on a weekday", () => {
      // Monday = 1
      jest.useFakeTimers().setSystemTime(new Date("2025-01-06T10:00:00"))
      mockUseAPI({ data: mockTasks, loading: false })
      render(<TodoPage />)
      expect(screen.getByText("Team standup")).toBeInTheDocument()
      expect(screen.queryByText("Grocery shopping")).not.toBeInTheDocument()
      jest.useRealTimers()
    })

    it("shows weekend tasks on a weekend", () => {
      // Saturday = 6
      jest.useFakeTimers().setSystemTime(new Date("2025-01-04T10:00:00"))
      mockUseAPI({ data: mockTasks, loading: false })
      render(<TodoPage />)
      expect(screen.getByText("Grocery shopping")).toBeInTheDocument()
      expect(screen.queryByText("Team standup")).not.toBeInTheDocument()
      jest.useRealTimers()
    })
  })

  // ── Toggle interaction ─────────────────────────────────────────────────────

  describe("task toggle", () => {
    it("marks a task as completed when clicked", async () => {
      mockUseAPI({ data: mockTasks, loading: false })
      render(<TodoPage />)

      const taskRow = screen.getByText("Morning run").closest("div[class*='rounded-xl']")!
      fireEvent.click(taskRow)

      await waitFor(() => {
        expect(screen.getByText("Morning run")).toHaveClass("line-through")
      })
    })

    it("un-marks a task when clicked a second time", async () => {
      mockUseAPI({ data: mockTasks, loading: false })
      render(<TodoPage />)

      const taskRow = screen.getByText("Morning run").closest("div[class*='rounded-xl']")!
      fireEvent.click(taskRow)
      fireEvent.click(taskRow)

      await waitFor(() => {
        expect(screen.getByText("Morning run")).not.toHaveClass("line-through")
      })
    })
  })

  // ── Progress bar ───────────────────────────────────────────────────────────

  describe("progress tracking", () => {
    it("starts at 0%", () => {
      mockUseAPI({ data: mockTasks, loading: false })
      render(<TodoPage />)
      expect(screen.getByText("0%")).toBeInTheDocument()
    })

    it("shows correct completed count after toggling", async () => {
      const dailyOnly = [
        { label: "Task A", schedule: "daily" },
        { label: "Task B", schedule: "daily" },
      ]
      mockUseAPI({ data: dailyOnly, loading: false })
      render(<TodoPage />)

      fireEvent.click(screen.getByText("Task A").closest("div[class*='rounded-xl']")!)

      await waitFor(() => {
        expect(screen.getByText("1 of 2 completed")).toBeInTheDocument()
        expect(screen.getByText("50%")).toBeInTheDocument()
      })
    })

    it("reaches 100% when all tasks are completed", async () => {
      const dailyOnly = [{ label: "Only task", schedule: "daily" }]
      mockUseAPI({ data: dailyOnly, loading: false })
      render(<TodoPage />)

      fireEvent.click(screen.getByText("Only task").closest("div[class*='rounded-xl']")!)

      await waitFor(() => {
        expect(screen.getByText("100%")).toBeInTheDocument()
      })
    })

    it("does not render the progress section when there are no tasks", () => {
      mockUseAPI({ data: [], loading: false })
      render(<TodoPage />)
      expect(screen.queryByText("Progress")).not.toBeInTheDocument()
    })
  })
})
