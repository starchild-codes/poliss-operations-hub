import { useSyncExternalStore } from "react";
import {
  collectors as initialCollectors,
  nextCollectorId,
  type Collector,
  type CollectorStatus,
  type CollectorType,
  type Zone,
} from "@/lib/mock-data";

// Central runtime store for collectors. Everything that needs to render collectors — the
// Collectors page, Tasks assignment dropdowns, Overview active-collector metrics — reads from
// this single source of truth via `useCollectorStore()` so Add / Edit / status-change actions
// propagate everywhere without page-local duplicate arrays.

let state: Collector[] = [...initialCollectors];
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export interface NewCollectorInput {
  name: string;
  phone: string;
  zone: Zone;
  status: CollectorStatus;
  collectorType?: CollectorType;
  organization?: string;
  preferredLanguage?: string;
  internalNotes?: string;
}

export const collectorStoreActions = {
  createCollector(input: NewCollectorInput, now: string): Collector {
    const collector: Collector = {
      id: nextCollectorId(),
      name: input.name,
      phone: input.phone,
      zone: input.zone,
      status: input.status,
      collectorType: input.collectorType,
      organization: input.organization,
      preferredLanguage: input.preferredLanguage,
      internalNotes: input.internalNotes,
      registeredAt: now,
      lastActiveAt: "—",
    };
    state = [collector, ...state];
    emit();
    return collector;
  },

  editCollector(id: string, patch: Partial<NewCollectorInput>) {
    state = state.map((c) => (c.id === id ? { ...c, ...patch } : c));
    emit();
  },

  setStatus(id: string, status: CollectorStatus) {
    state = state.map((c) => (c.id === id ? { ...c, status } : c));
    emit();
  },
};

export function useCollectorStore(): Collector[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// Non-hook accessor for read-only, non-reactive callers (e.g. helpers outside React).
export function getCollectors(): Collector[] {
  return state;
}
