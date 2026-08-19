import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/projects")({
  component: () => (
    <CrudManager
      table="projects"
      folder="projects"
      title="Projects"
      description="Case studies shown on the portfolio and on individual project pages."
      primaryField="title"
      secondaryField="short_description"
      fields={[
        { name: "title", label: "Title", type: "text" },
        { name: "slug", label: "Slug", type: "text", help: "Used in the project URL." },
        { name: "category", label: "Category", type: "text" },
        { name: "period", label: "Period", type: "text", placeholder: "2025" },
        { name: "short_description", label: "Short description", type: "textarea" },
        { name: "full_description", label: "Overview", type: "textarea" },
        { name: "problem", label: "Problem", type: "textarea" },
        { name: "solution", label: "Solution", type: "textarea" },
        { name: "implementation", label: "Implementation", type: "textarea" },
        { name: "outcome", label: "Results", type: "textarea" },
        { name: "features", label: "Key features", type: "list" },
        { name: "tech_stack", label: "Tech stack", type: "list" },
        { name: "cover_url", label: "Cover image", type: "media", full: true },
        { name: "demo_url", label: "Live demo URL", type: "text" },
        { name: "github_url", label: "Repository URL", type: "text" },
        { name: "is_featured", label: "Featured", type: "boolean" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_published", label: "Published", type: "boolean" },
      ]}
    />
  ),
});
