import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/certifications")({
  component: () => (
    <CrudManager
      table="certifications"
      title="Certifications"
      description="Courses and credentials displayed in the certifications grid."
      primaryField="title"
      secondaryField="issuer"
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "issuer", label: "Issuer", type: "text" },
        { name: "issued_on", label: "Issued", type: "text", placeholder: "2025" },
        { name: "credential_url", label: "Credential URL", type: "text" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});
