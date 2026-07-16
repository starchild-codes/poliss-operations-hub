import { useSyncExternalStore } from "react";
import {
  submissions as initialSubmissions,
  tasks as initialTasks,
  buildDefaultChecklist,
  CURRENT_OPERATOR,
  type Submission,
  type VerificationChecklist,
  type RejectionReason,
} from "@/lib/mock-data";
import { taskStoreActions } from "@/lib/task-store";

// Mirrors the pattern in `task-store.ts`: a tiny dependency-free store so the Review workspace can
// approve/reject submissions and toggle checklist items at runtime, with every consumer (Review
// table/drawer, Overview counts, Tasks drawer link) reading the same live list rather than a
// frozen import-time snapshot. Approving/rejecting here also calls into `taskStoreActions` so the
// linked task's status and event history update in the same action — that's the single place
// task/submission state is kept synchronized.

export type SubmissionWithChecklist = Submission & { checklist: VerificationChecklist };

let submissionsState: SubmissionWithChecklist[] = initialSubmissions.map((s) => ({
  ...s,
  checklist: buildDefaultChecklist(s, initialTasks.find((t) => t.id === s.taskId)),
}));
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return submissionsState;
}

function patch(id: string, fields: Partial<SubmissionWithChecklist>) {
  submissionsState = submissionsState.map((s) => (s.id === id ? { ...s, ...fields } : s));
}

export const submissionStoreActions = {
  toggleChecklistItem(submissionId: string, key: keyof VerificationChecklist) {
    const submission = submissionsState.find((s) => s.id === submissionId);
    if (!submission) return;
    patch(submissionId, { checklist: { ...submission.checklist, [key]: !submission.checklist[key] } });
    emit();
  },

  approve(submissionId: string, now: string) {
    const submission = submissionsState.find((s) => s.id === submissionId);
    if (!submission) return;
    patch(submissionId, { status: "approved", reviewer: CURRENT_OPERATOR, decidedAt: now });
    taskStoreActions.approveTask(submission.taskId, now);
    emit();
  },

  reject(submissionId: string, reason: RejectionReason, note: string | undefined, now: string) {
    const submission = submissionsState.find((s) => s.id === submissionId);
    if (!submission) return;
    patch(submissionId, {
      status: "rejected",
      reviewer: CURRENT_OPERATOR,
      decidedAt: now,
      rejectionReason: reason,
      rejectionNote: note,
    });
    taskStoreActions.rejectTask(submission.taskId, now, reason);
    emit();
  },
};

export function useSubmissionStore(): SubmissionWithChecklist[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
