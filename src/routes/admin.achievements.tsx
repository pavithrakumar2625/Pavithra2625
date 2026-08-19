import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/achievements")({
  component: () => (
    <CrudManager
      table="achievements"
      title="Achievements"
      description="Awards, hackathons and recognitions."
      primaryField="title"
      secondaryField="description"
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "year", label: "Year", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});
