import { useSyncExternalStore } from "react";
import {
  tasks as initialTasks,
  initialTaskEvents,
  nextTaskId,
  CURRENT_OPERATOR,
  taskTransitions,
  type Task,
  type TaskEvent,
  type TaskStatus,
  type HotspotType,
  type Priority,
  type Zone,
} from "@/lib/mock-data";

// A tiny, dependency-free store so the Tasks workspace can mutate the shared task list at
// runtime and every consumer (Tasks table, task drawer, Overview metrics) reads the same live
// data via `useTaskStore()` instead of a frozen import-time snapshot.

let tasksState: Task[] = [...initialTasks];
let eventsState: TaskEvent[] = [...initialTaskEvents];
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getTasksSnapshot() {
  return tasksState;
}

function getEventsSnapshot() {
  return eventsState;
}

function addEvent(taskId: string, message: string, timestamp: string) {
  eventsState = [...eventsState, { id: `${taskId}-E${eventsState.length + 1}-${Date.now()}`, taskId, timestamp, message }];
}

function touch(taskId: string, patch: Partial<Task>, now: string) {
  tasksState = tasksState.map((t) => (t.id === taskId ? { ...t, ...patch, updatedAt: now } : t));
}

export interface NewTaskInput {
  title: string;
  description: string;
  hotspotType: HotspotType;
  priority: Priority;
  assignee?: string;
  dueAt: string;
  location: string;
  latitude: number;
  longitude: number;
  zone: Zone;
  wasteType: Task["wasteType"];
  estimatedWasteKg?: number;
  instructions?: string;
  internalNotes?: string;
  hasReferencePhoto?: boolean;
}

export const taskStoreActions = {
  createTask(input: NewTaskInput, now: string): Task {
    const id = nextTaskId();
    const status: TaskStatus = input.assignee ? "assigned" : "open";
    const task: Task = {
      id,
      title: input.title,
      description: input.description,
      location: input.location,
      latitude: input.latitude,
      longitude: input.longitude,
      zone: input.zone,
      status,
      priority: input.priority,
      hotspotType: input.hotspotType,
      assignee: input.assignee,
      createdBy: CURRENT_OPERATOR,
      createdAt: now,
      updatedAt: now,
      dueAt: input.dueAt,
      wasteType: input.wasteType,
      estimatedWasteKg: input.estimatedWasteKg ?? 0,
      instructions: input.instructions,
      internalNotes: input.internalNotes,
      hasReferencePhoto: input.hasReferencePhoto,
    };
    tasksState = [task, ...tasksState];
    addEvent(id, `Task created by ${CURRENT_OPERATOR}`, now);
    if (input.assignee) addEvent(id, `Assigned to ${input.assignee}`, now);
    emit();
    return task;
  },

  editTask(taskId: string, patch: Partial<NewTaskInput>, now: string) {
    touch(taskId, patch as Partial<Task>, now);
    addEvent(taskId, "Task details updated", now);
    emit();
  },

  assignCollector(taskId: string, collector: string, now: string) {
    const task = tasksState.find((t) => t.id === taskId);
    if (!task) return;
    const allowed = taskTransitions[task.status].includes("assigned") || task.status === "assigned";
    const nextStatus: TaskStatus = task.status === "open" ? "assigned" : task.status;
    if (!allowed && task.status !== "open") return;
    touch(taskId, { assignee: collector, status: nextStatus }, now);
    addEvent(taskId, `Assigned to ${collector}`, now);
    emit();
  },

  reassignCollector(taskId: string, collector: string, now: string) {
    const task = tasksState.find((t) => t.id === taskId);
    if (!task) return;
    const previous = task.assignee;
    const nextStatus: TaskStatus = task.status === "declined" ? "assigned" : task.status;
    touch(taskId, { assignee: collector, status: nextStatus }, now);
    addEvent(
      taskId,
      previous ? `Reassigned from ${previous} to ${collector}` : `Assigned to ${collector}`,
      now,
    );
    emit();
  },

  cancelTask(taskId: string, now: string) {
    const task = tasksState.find((t) => t.id === taskId);
    if (!task) return;
    touch(taskId, { status: "canceled" }, now);
    addEvent(taskId, "Task canceled by operator", now);
    emit();
  },

  requestResubmission(taskId: string, now: string) {
    const task = tasksState.find((t) => t.id === taskId);
    if (!task) return;
    touch(taskId, {}, now);
    addEvent(taskId, `Resubmission requested from ${task.assignee ?? "collector"}`, now);
    emit();
  },

  // Called by the submission store when a reviewer approves proof of work — keeps the task's
  // status in lockstep with the submission decision everywhere the task is read (Tasks, Overview).
  approveTask(taskId: string, now: string) {
    const task = tasksState.find((t) => t.id === taskId);
    if (!task) return;
    touch(taskId, { status: "approved" }, now);
    addEvent(taskId, `Submission approved by ${CURRENT_OPERATOR}`, now);
    emit();
  },

  rejectTask(taskId: string, now: string, reason: string) {
    const task = tasksState.find((t) => t.id === taskId);
    if (!task) return;
    touch(taskId, { status: "rejected" }, now);
    addEvent(taskId, `Submission rejected by ${CURRENT_OPERATOR} — ${reason}`, now);
    emit();
  },
};

export function useTaskStore() {
  const tasks = useSyncExternalStore(subscribe, getTasksSnapshot, getTasksSnapshot);
  const events = useSyncExternalStore(subscribe, getEventsSnapshot, getEventsSnapshot);
  return { tasks, events };
}

export function useTaskEvents(taskId: string): TaskEvent[] {
  const events = useSyncExternalStore(subscribe, getEventsSnapshot, getEventsSnapshot);
  return events.filter((e) => e.taskId === taskId);
}
