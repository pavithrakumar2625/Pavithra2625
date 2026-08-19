import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/experience")({
  component: () => (
    <CrudManager
      table="experiences"
      title="Experience"
      description="Internships and professional roles displayed on the timeline."
      primaryField="role_title"
      secondaryField="company"
      fields={[
        { name: "role_title", label: "Role", type: "text" },
        { name: "company", label: "Company", type: "text" },
        { name: "location", label: "Location", type: "text" },
        { name: "period", label: "Period", type: "text" },
        { name: "summary", label: "Summary", type: "textarea" },
        { name: "highlights", label: "Highlights", type: "list" },
        { name: "tech", label: "Tools & tech", type: "list" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});
