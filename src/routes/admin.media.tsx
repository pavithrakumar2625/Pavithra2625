import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CrudManager } from "@/components/admin/CrudManager";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/media")({
  component: ProjectMediaPage,
});

function ProjectMediaPage() {
  const projects = useQuery({
    queryKey: ["admin", "projects", "options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const options = (projects.data ?? []).map((p) => ({ value: p.id, label: p.title }));

  return (
    <CrudManager
      table="project_media"
      folder="project-media"
      title="Project media"
      description="Upload images and videos for each project gallery. Files are stored securely in your backend."
      primaryField="caption"
      secondaryField="url"
      fields={[
        { name: "project_id", label: "Project", type: "select", options, full: true },
        {
          name: "media_type",
          label: "Media type",
          type: "select",
          options: [
            { value: "image", label: "Image" },
            { value: "video", label: "Video" },
          ],
        },
        { name: "caption", label: "Caption", type: "text" },
        {
          name: "url",
          label: "File",
          type: "media",
          accept: "image/*,video/*",
          full: true,
          help: "Upload an image or a video file, or paste an external URL.",
        },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_published", label: "Published", type: "boolean" },
      ]}
    />
  );
}
