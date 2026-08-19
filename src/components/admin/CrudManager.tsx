import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MediaField } from "@/components/admin/MediaField";
import { supabase } from "@/integrations/supabase/client";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "list" | "media" | "select";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
  full?: boolean;
};

type Row = Record<string, unknown> & { id: string };

export function CrudManager({
  table,
  title,
  description,
  fields,
  primaryField,
  secondaryField,
  folder = "content",
}: {
  table: string;
  title: string;
  description: string;
  fields: Field[];
  primaryField: string;
  secondaryField?: string;
  folder?: string;
}) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);

  const list = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table as never)
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", table] });
    queryClient.invalidateQueries();
  };

  const save = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      if (editing) {
        const { error } = await supabase
          .from(table as never)
          .update(values as never)
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table as never).insert(values as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Changes saved" : "Item created");
      setOpen(false);
      setEditing(null);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Item deleted");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const reorder = useMutation({
    mutationFn: async ({ row, direction }: { row: Row; direction: -1 | 1 }) => {
      const rows = list.data ?? [];
      const index = rows.findIndex((r) => r.id === row.id);
      const swap = rows[index + direction];
      if (!swap) return;
      await supabase
        .from(table as never)
        .update({ sort_order: (swap['sort_order'] as number) ?? 0 } as never)
        .eq("id", row.id);
      await supabase
        .from(table as never)
        .update({ sort_order: (row['sort_order'] as number) ?? 0 } as never)
        .eq("id", swap.id);
    },
    onSuccess: invalidate,
  });

  const togglePublish = useMutation({
    mutationFn: async (row: Row) => {
      const { error } = await supabase
        .from(table as never)
        .update({ is_published: !row['is_published'] } as never)
        .eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (error: Error) => toast.error(error.message),
  });

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };

  return (
    <div>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button className="shrink-0 rounded-xl" onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </header>

      <div className="mt-8 space-y-3">
        {list.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
        {list.data?.length === 0 ? (
          <div className="surface-panel p-8 text-center text-sm text-muted-foreground">
            Nothing here yet. Use “Add” to create the first item.
          </div>
        ) : null}

        {list.data?.map((row) => (
          <article
            key={row.id}
            className="surface-panel grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate font-medium">{String(row[primaryField] ?? "Untitled")}</h2>
                <Badge
                  variant={row['is_published'] ? "secondary" : "outline"}
                  className="rounded-md font-normal"
                >
                  {row['is_published'] ? "Published" : "Draft"}
                </Badge>
              </div>
              {secondaryField ? (
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {String(row[secondaryField] ?? "")}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Move up"
                className="rounded-lg"
                onClick={() => reorder.mutate({ row, direction: -1 })}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Move down"
                className="rounded-lg"
                onClick={() => reorder.mutate({ row, direction: 1 })}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Switch
                aria-label="Toggle published"
                checked={Boolean(row['is_published'])}
                onCheckedChange={() => togglePublish.mutate(row)}
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Edit"
                className="rounded-lg"
                onClick={() => {
                  setEditing(row);
                  setOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete"
                className="rounded-lg text-destructive"
                onClick={() => {
                  if (window.confirm("Delete this item permanently?")) remove.mutate(row.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </article>
        ))}
      </div>

      <EditorDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setEditing(null);
        }}
        title={editing ? `Edit ${title.toLowerCase()}` : `New ${title.toLowerCase()}`}
        fields={fields}
        folder={folder}
        initial={editing ?? undefined}
        saving={save.isPending}
        onSubmit={(values) => save.mutate(values)}
      />
    </div>
  );
}

export function EditorDialog({
  open,
  onOpenChange,
  title,
  fields,
  initial,
  onSubmit,
  saving,
  folder = "content",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: Field[];
  initial?: Record<string, unknown> | undefined;
  onSubmit: (values: Record<string, unknown>) => void;
  saving: boolean;
  folder?: string;
}) {
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [key, setKey] = useState(0);

  // Reset the form whenever the dialog opens for a different record.
  const initialId = (initial?.['id'] as string) ?? "new";
  const [lastId, setLastId] = useState(initialId);
  if (open && lastId !== initialId) {
    setLastId(initialId);
    setValues(initial ?? {});
    setKey((k) => k + 1);
  }
  if (open && key === 0) {
    setValues(initial ?? {});
    setKey(1);
  }

  const set = (name: string, value: unknown) => setValues((v) => ({ ...v, [name]: value }));

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setKey(0);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Changes publish to the live portfolio as soon as you save.
          </DialogDescription>
        </DialogHeader>

        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            const payload: Record<string, unknown> = {};
            fields.forEach((field) => {
              const raw = values[field.name];
              if (field.type === "number") payload[field.name] = Number(raw ?? 0);
              else if (field.type === "boolean") payload[field.name] = Boolean(raw);
              else if (field.type === "list")
                payload[field.name] = String(raw ?? "")
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean);
              else payload[field.name] = raw ?? "";
            });
            onSubmit(payload);
          }}
        >
          {fields.map((field) => (
            <div
              key={field.name}
              className={field.full || field.type === "textarea" ? "space-y-2 sm:col-span-2" : "space-y-2"}
            >
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  rows={4}
                  placeholder={field.placeholder}
                  value={String(values[field.name] ?? "")}
                  onChange={(e) => set(field.name, e.target.value)}
                />
              ) : field.type === "list" ? (
                <Textarea
                  id={field.name}
                  rows={4}
                  placeholder={field.placeholder ?? "One item per line"}
                  value={
                    Array.isArray(values[field.name])
                      ? (values[field.name] as string[]).join("\n")
                      : String(values[field.name] ?? "")
                  }
                  onChange={(e) => set(field.name, e.target.value)}
                />
              ) : field.type === "boolean" ? (
                <div className="flex h-10 items-center">
                  <Switch
                    id={field.name}
                    checked={Boolean(values[field.name])}
                    onCheckedChange={(checked) => set(field.name, checked)}
                  />
                </div>
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={String(values[field.name] ?? "")}
                  onChange={(e) => set(field.name, e.target.value)}
                >
                  <option value="">Select…</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "media" ? (
                <MediaField
                  folder={folder}
                  value={(values[field.name] as string) ?? ""}
                  onChange={(next) => set(field.name, next)}
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type === "number" ? "number" : "text"}
                  placeholder={field.placeholder}
                  value={String(values[field.name] ?? "")}
                  onChange={(e) => set(field.name, e.target.value)}
                />
              )}
              {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
            </div>
          ))}

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
