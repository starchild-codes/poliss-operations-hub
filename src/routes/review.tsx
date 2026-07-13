import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/page-header";
import { submissions as initial } from "@/lib/mock-data";
import { CheckCircle2, XCircle, ImageIcon, MapPin } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Review — Poliss" },
      { name: "description", content: "Review proof-of-work submissions from collectors." },
    ],
  }),
  component: ReviewPage,
});

function ReviewPage() {
  const [items, setItems] = useState(initial.filter((s) => s.status === "pending"));

  const decide = (id: string, decision: "approved" | "rejected") => {
    setItems((prev) => prev.filter((s) => s.id !== id));
    toast[decision === "approved" ? "success" : "error"](
      `Submission ${decision}`,
      { description: `Marked ${id} as ${decision}.` },
    );
  };

  return (
    <>
      <PageHeader
        title="Review"
        description={`${items.length} submissions awaiting review`}
        actions={<Button variant="outline" size="sm">History</Button>}
      />

      <div className="p-6">
        {items.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="All caught up"
            description="No submissions are waiting on you. New proof-of-work will appear here when collectors submit via WhatsApp."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((s) => (
              <article key={s.id} className="flex flex-col overflow-hidden rounded-md border border-border bg-card">
                <div className="grid aspect-video place-items-center bg-muted text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{s.taskId}</span>
                    <span>·</span>
                    <span>{s.zone}</span>
                    <span className="ml-auto">{s.submittedAt}</span>
                  </div>
                  <h3 className="mt-1 text-sm font-semibold text-foreground">{s.taskTitle}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> Submitted by {s.collector}
                  </div>
                  {s.note && (
                    <p className="mt-2 rounded border border-border bg-background px-2 py-1.5 text-xs text-foreground">
                      "{s.note}"
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1 text-destructive hover:text-destructive">
                          <XCircle className="h-4 w-4" /> Reject
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject submission?</AlertDialogTitle>
                          <AlertDialogDescription>
                            The collector will be asked to revisit and resubmit proof for {s.taskId}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => decide(s.id, "rejected")}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Reject
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button size="sm" className="ml-auto gap-1" onClick={() => decide(s.id, "approved")}>
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
