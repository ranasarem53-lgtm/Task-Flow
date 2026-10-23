import { Link } from 'react-router-dom'
import { DashboardTasks, SummaryCards } from '../../features/tasks/components/dashboard-tasks'
import { useTasks } from '../../features/tasks/hooks/use-tasks'

export default function DashboardPage() {
  const { tasks, isLoading, error, reload } = useTasks()

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <span>Welcome to TaskFlow!</span>
      </div>

      <SummaryCards tasks={tasks} />

      <section className="dashboard-section">
        <h2>My Tasks</h2>
        <DashboardTasks
          tasks={tasks}
          isLoading={isLoading}
          error={error}
          onReload={() => void reload()}
        />
        <p>
          <Link to="/tasks">Go to Tasks page</Link>
        </p>
      </section>
    </div>
  )
}