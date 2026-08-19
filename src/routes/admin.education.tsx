import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/education")({
  component: () => (
    <CrudManager
      table="education"
      title="Education"
      description="Academic qualifications shown in the education timeline."
      primaryField="degree"
      secondaryField="institution"
      fields={[
        { name: "degree", label: "Degree", type: "text" },
        { name: "institution", label: "Institution", type: "text" },
        { name: "location", label: "Location", type: "text" },
        { name: "period", label: "Period", type: "text" },
        { name: "score", label: "Score / CGPA", type: "text" },
        { name: "details", label: "Details", type: "textarea" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});
