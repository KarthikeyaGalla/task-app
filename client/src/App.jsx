import React, { useEffect, useState } from 'react';
import { format, isToday, isFuture, parseISO, isPast, isSameDay } from 'date-fns';
import { api } from './api';
import { TaskForm } from './components/TaskForm';
import { WorkflowBoard } from './components/WorkflowBoard';
import { UpcomingTasks } from './components/UpcomingTasks';
import { LayoutDashboard } from 'lucide-react';
import { EditTaskModal } from './components/EditTaskModal';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskAdded = () => {
    fetchTasks();
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const task = tasks.find(t => t.TaskId === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId;

    // Optimistic update
    const updatedTasks = tasks.map(t =>
      t.TaskId === draggableId ? { ...t, Status: newStatus } : t
    );
    setTasks(updatedTasks);

    // API update
    try {
      await api.updateTask(draggableId, { Status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
      fetchTasks(); // Revert on error
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter(t => t.TaskId !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  // Filter Logic
  const today = new Date();

  const todayTasks = tasks.filter(task => {
    const dueDate = parseISO(task.DueDate);
    // Show in workflow if Due Date is Today (or overdue and not completed?)
    // User said: "if we create the task for today then defaultly the duedate is today so it need to show in the workflow"
    return isSameDay(dueDate, today) || (isPast(dueDate) && !isSameDay(dueDate, today) && task.Status !== 'Completed');
  });

  const upcomingTasks = tasks.filter(task => {
    const dueDate = parseISO(task.DueDate);
    return isFuture(dueDate) && !isSameDay(dueDate, today);
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              Task Manager
            </h1>
            <p className="text-gray-500 font-medium">
              {format(today, 'EEEE, MMMM do, yyyy')}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border text-sm font-medium text-gray-600">
            <LayoutDashboard size={18} className="text-blue-500" />
            <span>{todayTasks.length} Tasks Today</span>
          </div>
        </header>

        <TaskForm onTaskAdded={handleTaskAdded} />

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
              Today's Workflow
            </h2>
            <WorkflowBoard
              tasks={todayTasks}
              onDragEnd={handleDragEnd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </section>

          <UpcomingTasks
            tasks={upcomingTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={editingTask}
        onTaskUpdated={handleTaskAdded}
      />
    </div>
  );
}

export default App;
