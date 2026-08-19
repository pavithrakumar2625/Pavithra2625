import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CrudManager } from "@/components/admin/CrudManager";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/skills")({
  component: SkillsAdmin,
});

function SkillsAdmin() {
  const categories = useQuery({
    queryKey: ["admin", "skill_categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("skill_categories")
        .select("id,name")
        .order("sort_order", { ascending: true });
      return (data ?? []) as { id: string; name: string }[];
    },
  });

  return (
    <div className="space-y-16">
      <CrudManager
        table="skill_categories"
        title="Skill categories"
        description="Groups that organise the skills grid, e.g. Programming or Machine Learning."
        primaryField="name"
        secondaryField="description"
        fields={[
          { name: "name", label: "Name", type: "text" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "is_published", label: "Published", type: "boolean" },
        ]}
      />

      <CrudManager
        table="skills"
        title="Skills"
        description="Individual skills with proficiency levels."
        primaryField="name"
        fields={[
          { name: "name", label: "Skill", type: "text" },
          {
            name: "category_id",
            label: "Category",
            type: "select",
            options: (categories.data ?? []).map((c) => ({ value: c.id, label: c.name })),
          },
          {
            name: "proficiency",
            label: "Proficiency (0-100)",
            type: "number",
          },
          { name: "sort_order", label: "Sort order", type: "number" },
          { name: "is_published", label: "Published", type: "boolean" },
        ]}
      />
    </div>
  );
}
