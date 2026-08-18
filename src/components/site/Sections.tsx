import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  Building2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Section } from "@/components/site/Section";
import { SmartImage } from "@/components/site/SmartImage";
import type { Profile, Project } from "@/lib/portfolio";

export function About({
  profile,
  education,
}: {
  profile: Profile;
  education: { id: string; degree: string; institution: string; score: string; period: string }[];
}) {
  const facts = [
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone },
    { icon: MapPin, label: "Location", value: profile.location },
    {
      icon: GraduationCap,
      label: "Education",
      value: education[0] ? `${education[0].degree} · ${education[0].score}` : "—",
    },
  ];

  return (
    <Section
      id="about"
      eyebrow="About"
      title="Engineering clarity out of complex data"
      description={profile.about}
    >
      <dl className="grid gap-4 sm:grid-cols-2">
        {facts.map((fact) => (
          <div key={fact.label} className="surface-panel flex items-start gap-4 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
              <fact.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {fact.label}
              </dt>
              <dd className="mt-1 break-words text-sm font-medium">{fact.value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </Section>
  );
}

export function Skills({
  categories,
  skills,
}: {
  categories: { id: string; name: string; description: string }[];
  skills: { id: string; category_id: string | null; name: string; proficiency: number }[];
}) {
  return (
    <Section
      id="skills"
      eyebrow="Capabilities"
      title="Technical skill system"
      description="Grouped by how the work actually happens — from modelling and experimentation through to analytics delivery and production engineering."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {categories.map((category) => {
          const items = skills.filter((s) => s.category_id === category.id);
          if (!items.length) return null;
          return (
            <article key={category.id} className="surface-panel lift-on-hover p-6">
              <h3 className="font-display text-lg font-semibold">{category.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{category.description}</p>
              <ul className="mt-6 space-y-4">
                {items.map((skill) => (
                  <li key={skill.id}>
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="min-w-0 truncate font-medium">{skill.name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {skill.proficiency}%
                      </span>
                    </div>
                    <Progress value={skill.proficiency} className="mt-2 h-1.5" />
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

export function Experience({
  experiences,
}: {
  experiences: {
    id: string;
    role_title: string;
    company: string;
    location: string;
    period: string;
    summary: string;
    highlights: string[];
    tech: string[];
  }[];
}) {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Applied industry work"
      description="Hands-on machine learning delivery against real datasets and real constraints."
    >
      <ol className="relative space-y-8 border-l border-border pl-6 sm:pl-8">
        {experiences.map((item) => (
          <li key={item.id} className="relative">
            <span className="absolute -left-[1.9rem] top-2 grid h-4 w-4 place-items-center rounded-full border-2 border-primary bg-background sm:-left-[2.4rem]" />
            <article className="surface-panel lift-on-hover p-6">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold">{item.role_title}</h3>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span>{item.company}</span>
                    {item.location ? <span>· {item.location}</span> : null}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 rounded-lg">
                  {item.period}
                </Badge>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
              <ul className="mt-4 space-y-2">
                {item.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2.5 text-sm leading-relaxed">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {item.tech.map((tech) => (
                  <Badge key={tech} variant="outline" className="rounded-md font-normal">
                    {tech}
                  </Badge>
                ))}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <Section
      id="projects"
      eyebrow="Case studies"
      title="Projects with measurable outcomes"
      description="Each project is documented as a full case study: the problem, the technical approach, the implementation and the result."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <article key={project.id} className="surface-panel lift-on-hover flex flex-col overflow-hidden">
            <div className="aspect-[16/9] w-full overflow-hidden border-b border-border bg-elevated">
              <SmartImage
                src={project.cover_url}
                alt={project.title}
                className="h-full w-full object-cover"
                fallback={
                  <div className="hero-glow grid h-full w-full place-items-center">
                    <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      {project.category || "Case study"}
                    </span>
                  </div>
                }
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-primary">{project.category}</span>
                <span>·</span>
                <span>{project.period}</span>
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold leading-snug">
                {project.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {project.short_description}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.tech_stack.slice(0, 6).map((tech) => (
                  <Badge key={tech} variant="outline" className="rounded-md font-normal">
                    {tech}
                  </Badge>
                ))}
                {project.tech_stack.length > 6 ? (
                  <Badge variant="secondary" className="rounded-md font-normal">
                    +{project.tech_stack.length - 6}
                  </Badge>
                ) : null}
              </div>
              <div className="mt-6 pt-2">
                <Button asChild variant="outline" className="rounded-xl">
                  <Link to="/projects/$slug" params={{ slug: project.slug }}>
                    View case study <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Education({
  education,
}: {
  education: {
    id: string;
    degree: string;
    institution: string;
    location: string;
    period: string;
    score: string;
    details: string;
  }[];
}) {
  return (
    <Section id="education" eyebrow="Education" title="Academic foundation">
      <div className="grid gap-5 lg:grid-cols-2">
        {education.map((item) => (
          <article key={item.id} className="surface-panel lift-on-hover p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                <GraduationCap className="h-4 w-4" />
              </span>
              <Badge variant="secondary" className="rounded-lg">
                {item.period}
              </Badge>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{item.degree}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.institution}
              {item.location ? ` · ${item.location}` : ""}
            </p>
            <p className="mt-4 font-display text-2xl font-semibold text-primary">{item.score}</p>
            {item.details ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.details}</p>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Certifications({
  certifications,
}: {
  certifications: {
    id: string;
    title: string;
    issuer: string;
    issued_on: string;
    credential_url: string | null;
  }[];
}) {
  return (
    <Section id="certifications" eyebrow="Credentials" title="Certifications & coursework">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((item) => (
          <article key={item.id} className="surface-panel lift-on-hover p-5">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="mt-4 font-display text-base font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.issuer}
              {item.issued_on ? ` · ${item.issued_on}` : ""}
            </p>
            {item.credential_url ? (
              <a
                href={item.credential_url}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-flex items-center text-sm font-medium text-primary"
              >
                View credential <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Achievements({
  achievements,
}: {
  achievements: { id: string; title: string; description: string; year: string }[];
}) {
  return (
    <Section id="achievements" eyebrow="Recognition" title="Achievements & activities">
      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((item) => (
          <article key={item.id} className="surface-panel lift-on-hover flex gap-4 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Trophy className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-base font-semibold">{item.title}</h3>
                {item.year ? (
                  <Badge variant="secondary" className="rounded-md font-normal">
                    {item.year}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
