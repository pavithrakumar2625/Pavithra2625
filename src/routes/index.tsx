import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Hero } from "@/components/site/Hero";
import {
  About,
  Achievements,
  Certifications,
  Education,
  Experience,
  Projects,
  Skills,
} from "@/components/site/Sections";
import { Contact } from "@/components/site/Contact";
import { resolveMediaUrl } from "@/lib/media";
import {
  achievementsQuery,
  certificationsQuery,
  educationQuery,
  experiencesQuery,
  profileQuery,
  projectsQuery,
  resumeQuery,
  skillCategoriesQuery,
  skillsQuery,
  socialLinksQuery,
} from "@/lib/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pavithra K — AI & Data Science Portfolio" },
      {
        name: "description",
        content:
          "AI and Data Science portfolio of Pavithra K: machine learning case studies, analytics dashboards, experience, certifications and resume.",
      },
      { property: "og:title", content: "Pavithra K — AI & Data Science Portfolio" },
      {
        property: "og:description",
        content:
          "Machine learning and analytics case studies, experience and credentials from Pavithra K, AI & Data Science engineer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const profile = useQuery(profileQuery);
  const links = useQuery(socialLinksQuery);
  const categories = useQuery(skillCategoriesQuery);
  const skills = useQuery(skillsQuery);
  const experiences = useQuery(experiencesQuery);
  const education = useQuery(educationQuery);
  const certifications = useQuery(certificationsQuery);
  const achievements = useQuery(achievementsQuery);
  const projects = useQuery(projectsQuery);
  const resume = useQuery(resumeQuery);

  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  useEffect(() => {
    resolveMediaUrl(resume.data?.file_url).then(setResumeUrl);
  }, [resume.data?.file_url]);

  if (!profile.data) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <p className="text-sm text-muted-foreground">Loading portfolio…</p>
      </main>
    );
  }

  const socials = links.data ?? [];

  return (
    <div className="min-h-screen">
      <SiteHeader name={profile.data.full_name} />
      <main>
        <Hero profile={profile.data} links={socials} resumeUrl={resumeUrl} />
        <About profile={profile.data} education={education.data ?? []} />
        <Skills categories={categories.data ?? []} skills={skills.data ?? []} />
        <Experience experiences={experiences.data ?? []} />
        <Projects projects={projects.data ?? []} />
        <Education education={education.data ?? []} />
        <Certifications certifications={certifications.data ?? []} />
        <Achievements achievements={achievements.data ?? []} />
        <Contact profile={profile.data} links={socials} />
      </main>
      <SiteFooter name={profile.data.full_name} links={socials} />
    </div>
  );
}
