import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  full_name: string;
  headline: string;
  tagline: string;
  about: string;
  email: string;
  phone: string;
  location: string;
  avatar_url: string | null;
  stat_projects: string;
  stat_internships: string;
  stat_cgpa: string;
  stat_certifications: string;
  contact_heading: string;
  contact_description: string;
  contact_note: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  period: string;
  short_description: string;
  full_description: string;
  problem: string;
  solution: string;
  implementation: string;
  outcome: string;
  features: string[];
  tech_stack: string[];
  cover_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
};

const table = (name: string) => supabase.from(name as never);

async function listPublished<T>(name: string, order = "sort_order"): Promise<T[]> {
  const { data, error } = await table(name)
    .select("*")
    .eq("is_published", true)
    .order(order, { ascending: true });
  if (error) throw error;
  return (data ?? []) as T[];
}

export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: async () => {
    const { data, error } = await supabase.from("profile").select("*").limit(1).maybeSingle();
    if (error) throw error;
    return (data ?? null) as Profile | null;
  },
});

export const socialLinksQuery = queryOptions({
  queryKey: ["social_links"],
  queryFn: () =>
    listPublished<{ id: string; platform: string; url: string }>("social_links"),
});

export const skillCategoriesQuery = queryOptions({
  queryKey: ["skill_categories"],
  queryFn: () =>
    listPublished<{ id: string; name: string; description: string }>("skill_categories"),
});

export const skillsQuery = queryOptions({
  queryKey: ["skills"],
  queryFn: () =>
    listPublished<{
      id: string;
      category_id: string | null;
      name: string;
      proficiency: number;
    }>("skills"),
});

export const experiencesQuery = queryOptions({
  queryKey: ["experiences"],
  queryFn: () =>
    listPublished<{
      id: string;
      role_title: string;
      company: string;
      location: string;
      period: string;
      summary: string;
      highlights: string[];
      tech: string[];
    }>("experiences"),
});

export const educationQuery = queryOptions({
  queryKey: ["education"],
  queryFn: () =>
    listPublished<{
      id: string;
      degree: string;
      institution: string;
      location: string;
      period: string;
      score: string;
      details: string;
    }>("education"),
});

export const certificationsQuery = queryOptions({
  queryKey: ["certifications"],
  queryFn: () =>
    listPublished<{
      id: string;
      title: string;
      issuer: string;
      issued_on: string;
      credential_url: string | null;
    }>("certifications"),
});

export const achievementsQuery = queryOptions({
  queryKey: ["achievements"],
  queryFn: () =>
    listPublished<{ id: string; title: string; description: string; year: string }>("achievements"),
});

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: () => listPublished<Project>("projects"),
});

export const resumeQuery = queryOptions({
  queryKey: ["resume"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return (data ?? null) as { id: string; label: string; file_url: string } | null;
  },
});

export function projectQuery(slug: string) {
  return queryOptions({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as Project | null;
    },
  });
}

export function projectMediaQuery(projectId?: string) {
  return queryOptions({
    queryKey: ["project_media", projectId],
    enabled: Boolean(projectId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_media")
        .select("*")
        .eq("project_id", projectId!)
        .eq("is_published", true)
        .neq("url", "")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as {
        id: string;
        url: string;
        caption: string;
        media_type: string;
      }[];
    },
  });
}
