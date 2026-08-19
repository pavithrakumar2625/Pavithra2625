import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/messages")({
  component: MessagesAdmin,
});

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

function MessagesAdmin() {
  const queryClient = useQueryClient();
  const list = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Message[];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin"] });

  const toggleRead = useMutation({
    mutationFn: async (message: Message) => {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: !message.is_read })
        .eq("id", message.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Message deleted");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div>
      <header>
        <h1 className="font-display text-2xl font-semibold">Inbox</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enquiries submitted through the portfolio contact form.
        </p>
      </header>

      <div className="mt-8 space-y-4">
        {list.data?.length === 0 ? (
          <div className="surface-panel p-8 text-center text-sm text-muted-foreground">
            No messages yet.
          </div>
        ) : null}

        {list.data?.map((message) => (
          <article key={message.id} className="surface-panel p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-medium">{message.name}</h2>
                  {!message.is_read ? (
                    <Badge className="rounded-md font-normal">New</Badge>
                  ) : null}
                </div>
                <a
                  href={`mailto:${message.email}`}
                  className="text-sm text-primary hover:underline"
                >
                  {message.email}
                </a>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg"
                  aria-label="Toggle read"
                  onClick={() => toggleRead.mutate(message)}
                >
                  {message.is_read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg text-destructive"
                  aria-label="Delete message"
                  onClick={() => {
                    if (window.confirm("Delete this message?")) remove.mutate(message.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {message.subject ? (
              <p className="mt-4 text-sm font-medium">{message.subject}</p>
            ) : null}
            <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
              {message.message}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {new Date(message.created_at).toLocaleString()}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
