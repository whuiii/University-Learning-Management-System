import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Check, Search, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../components/ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useTheme } from '../../contexts/ThemeContext';
import { INITIAL_SKILLS, INITIAL_PROGRAMMES } from '../../data/programmes';
import type { Programme, ProgrammeCourse, Skill } from '../../types';
import { serif } from '../../utils/helpers';

type View = 'programs' | 'courses' | 'mapping';

// ─── Helpers ──────────────────────────────────────────────────
function getSkill(allSkills: Skill[], id: string) {
  return allSkills.find((s) => s.id === id);
}

// ─── Shared UI ────────────────────────────────────────────────
function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border bg-card p-6 space-y-6 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1.5 rounded-full bg-primary" />
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {subtitle && <p className="text-sm pl-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

// ─── Add Skill Modal ──────────────────────────────────────────
function AddSkillModal({
  open,
  onClose,
  onAdd,
  existingSkills,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (skill: Skill) => void;
  existingSkills: Skill[];
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Skill['category']>('technical');
  const [error, setError] = useState('');

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Skill name is required.');
      return;
    }
    const duplicate = existingSkills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase());
    if (duplicate) {
      setError('A skill with this name already exists.');
      return;
    }
    onAdd({ id: `custom-${Date.now()}`, name: trimmed, category });
    setName('');
    setCategory('technical');
    setError('');
    onClose();
  }

  if (!open) return null;

  const catStyle = {
    technical: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      bar: 'bg-blue-500',
      label: 'Technical',
    },
    soft: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      bar: 'bg-emerald-500',
      label: 'Soft Skill',
    },
    domain: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      bar: 'bg-amber-500',
      label: 'Domain',
    },
  };

  const CAT_OPTIONS: Skill['category'][] = ['technical', 'soft'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-foreground">Add New Skill</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Define a skill and classify its type for filtering
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
            <X className="size-5" />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-foreground mb-1.5">
            Skill Name <span className="text-destructive">*</span>
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="e.g. Machine Learning, Negotiation, AutoCAD…"
            className="w-full px-3 py-2.5 rounded-xl text-sm bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
          />
          {error && <p className="text-xs mt-1.5 text-destructive">{error}</p>}
        </div>
        <div className="mb-6">
          <label className="block text-xs font-medium text-foreground mb-2">
            Skill Category <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CAT_OPTIONS.map((cat) => {
              const s = catStyle[cat];
              const selected = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 text-xs font-medium transition-all ${
                    selected
                      ? `${s.bg} ${s.text} border-${cat}-500 dark:border-${cat}-400`
                      : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <span className="text-base">{cat === 'technical' ? '⚙️' : '💬'}</span>
                  <span>{s.label}</span>
                  {selected && (
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary">
                      <Check className="size-2.5 text-primary-foreground" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className={`mt-2.5 px-3 py-2 rounded-lg text-xs ${catStyle[category].bg} ${catStyle[category].text}`}>
            {category === 'technical' &&
              'Technical skills are tool or language-specific competencies (e.g. Python, SQL, React).'}
            {category === 'soft' &&
              'Soft skills are interpersonal or professional abilities (e.g. Communication, Teamwork).'}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-muted/50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Skill
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────
export function AdminProgrammeManagement() {
  const { theme } = useTheme();
  const [view, setView] = useState<View>('programs');
  const [selectedProgram, setSelectedProgram] = useState<Programme | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<ProgrammeCourse | null>(null);
  const [programs, setPrograms] = useState<Programme[]>(INITIAL_PROGRAMMES);
  const [allSkills, setAllSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [editingCourse, setEditingCourse] = useState<ProgrammeCourse | null>(null);
  const [editBuffer, setEditBuffer] = useState<ProgrammeCourse | null>(null);
  const [searchSkill, setSearchSkill] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ courseId: string; programId: string } | null>(null);

  function getLiveProg(id: string) {
    return programs.find((p) => p.id === id)!;
  }

  function getLiveCourse(pid: string, cid: string) {
    return getLiveProg(pid).courses.find((c) => c.id === cid)!;
  }

  const prog = selectedProgram ? getLiveProg(selectedProgram.id) : null;
  const liveCourse = prog && selectedCourse ? getLiveCourse(prog.id, selectedCourse.id) : null;

  function goToPrograms() {
    setView('programs');
    setSelectedProgram(null);
    setSelectedCourse(null);
  }

  function goToCourses(p: Programme) {
    setSelectedProgram(p);
    setView('courses');
    setSelectedCourse(null);
  }

  function goToMapping(c: ProgrammeCourse) {
    setSelectedCourse(c);
    setView('mapping');
  }

  function handleAddSkill(skill: Skill) {
    setAllSkills((prev) => [...prev, skill]);
  }

  function toggleSkill(skillId: string, courseId: string, programId: string) {
    setPrograms((prev) =>
      prev.map((p) =>
        p.id !== programId
          ? p
          : {
              ...p,
              courses: p.courses.map((c) =>
                c.id !== courseId
                  ? c
                  : {
                      ...c,
                      skills: c.skills.includes(skillId)
                        ? c.skills.filter((s) => s !== skillId)
                        : [...c.skills, skillId],
                    }
              ),
            }
      )
    );
    if (selectedCourse?.id === courseId) {
      const updated = programs
        .find((p) => p.id === programId)
        ?.courses.find((c) => c.id === courseId);
      if (updated)
        setSelectedCourse({
          ...updated,
          skills: updated.skills.includes(skillId)
            ? updated.skills.filter((s) => s !== skillId)
            : [...updated.skills, skillId],
        });
    }
  }

  function saveEdit() {
    if (!editBuffer || !prog) return;

    const savedCourse: ProgrammeCourse = {
      ...editBuffer,
      code: editBuffer.code.trim(),
      name: editBuffer.name.trim(),
    };
    const isExistingCourse = prog.courses.some((course) => course.id === savedCourse.id);

    setPrograms((prev) =>
      prev.map((p) =>
        p.id !== prog.id
          ? p
          : {
              ...p,
              courses: isExistingCourse
                ? p.courses.map((course) => (course.id === savedCourse.id ? savedCourse : course))
                : [...p.courses, savedCourse],
            }
      )
    );
    setEditingCourse(null);
    setEditBuffer(null);
  }

  function deleteCourse(courseId: string, programId: string) {
    setPrograms((prev) =>
      prev.map((p) =>
        p.id !== programId ? p : { ...p, courses: p.courses.filter((c) => c.id !== courseId) }
      )
    );
    if (selectedCourse?.id === courseId) {
      setSelectedCourse(null);
      setView('courses');
    }
    if (editingCourse?.id === courseId) {
      setEditingCourse(null);
      setEditBuffer(null);
    }
  }

  function totalSkills() {
    if (!prog) return 0;
    const s = new Set<string>();
    prog.courses.forEach((c) => c.skills.forEach((id) => s.add(id)));
    return s.size;
  }

  const filteredSkills = allSkills.filter(
    (s) =>
      (filterCat === 'all' || s.category === filterCat) &&
      s.name.toLowerCase().includes(searchSkill.toLowerCase())
  );
  const courseRows =
    prog &&
    editBuffer &&
    !prog.courses.some((course) => course.id === editBuffer.id)
      ? [...prog.courses, editBuffer]
      : (prog?.courses ?? []);
  const canSaveCourse =
    editBuffer !== null &&
    editBuffer.code.trim().length > 0 &&
    editBuffer.name.trim().length > 0 &&
    editBuffer.year > 0 &&
    editBuffer.credits > 0;

  const catStyle = {
    technical: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    soft: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    domain: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div>
      <h1 className="text-2xl font-normal text-foreground" style={{ fontFamily: serif }}>
        Programme Management
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Manage degree programmes, courses, and skill mappings
      </p>
    </div>
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center rounded-2xl border bg-muted/30 px-5 py-3">
          <Breadcrumb>
            <BreadcrumbList className="gap-2">
              <BreadcrumbItem>
                {view === 'programs' ? (
                  <BreadcrumbPage className="font-medium text-primary">Degree</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <button onClick={goToPrograms} className="font-medium text-primary/80 hover:text-primary">
                      Degree
                    </button>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="size-3.5 text-muted-foreground" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {view === 'courses' ? (
                  <BreadcrumbPage className="font-medium text-primary">Courses</BreadcrumbPage>
                ) : prog ? (
                  <BreadcrumbLink asChild>
                    <button onClick={() => goToCourses(prog)} className="font-medium text-primary/80 hover:text-primary">
                      Courses
                    </button>
                  </BreadcrumbLink>
                ) : (
                  <span className="font-medium text-muted-foreground/50">Courses</span>
                )}
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="size-3.5 text-muted-foreground" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {view === 'mapping' ? (
                  <BreadcrumbPage className="font-medium text-primary">Skill Mapping</BreadcrumbPage>
                ) : liveCourse ? (
                  <BreadcrumbLink asChild>
                    <button onClick={() => goToMapping(liveCourse)} className="font-medium text-primary/80 hover:text-primary">
                      Skill Mapping
                    </button>
                  </BreadcrumbLink>
                ) : (
                  <span className="font-medium text-muted-foreground/50">Skill Mapping</span>
                )}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <AnimatePresence mode="wait">
          {/* ─── PROGRAMMES VIEW ────────────────────────────── */}
          {view === 'programs' && (
            <motion.div
              key="programs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              <Section>
                <SectionHeader
                  title="Degree Programmes"
                  subtitle="Select a programme to view its courses and curriculum map"
                />
                <div className="grid gap-5 md:grid-cols-2">
                  {programs.map((p) => {
                    const skillSet = new Set<string>();
                    p.courses.forEach((c) => c.skills.forEach((s) => skillSet.add(s)));
                    return (
                      <div
                        key={p.id}
                        onClick={() => goToCourses(p)}
                        className="rounded-xl border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden group"
                      >
                        <div className="h-1.5 w-full bg-primary" />
                        <div className="p-5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-base text-foreground group-hover:text-primary transition">
                                {p.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {p.faculty} · {p.duration}
                              </p>
                            </div>
                            <span className="text-xs px-2.5 py-1 rounded-full border bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-medium">
                              {p.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { label: 'Students', v: p.activeStudents },
                              { label: 'Courses', v: p.courses.length },
                              { label: 'Skills', v: skillSet.size },
                            ].map((m) => (
                              <div key={m.label} className="rounded-lg p-3 bg-muted/40">
                                <p className="text-lg font-bold text-primary">{m.v}</p>
                                <p className="text-xs text-muted-foreground/80">{m.label}</p>
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {[...skillSet].slice(0, 5).map((sid) => {
                              const sk = getSkill(allSkills, sid);
                              return sk ? (
                                <span
                                  key={sid}
                                  className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-muted text-foreground/80"
                                >
                                  {sk.name}
                                </span>
                              ) : null;
                            })}
                            {skillSet.size > 5 && (
                              <span className="text-xs text-muted-foreground">+{skillSet.size - 5} more</span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-primary/80 text-right group-hover:text-primary transition">
                            View courses →
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>
            </motion.div>
          )}

          {/* ─── COURSES VIEW ────────────────────────────────── */}
          {view === 'courses' && prog && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              <header className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{prog.name}</h1>
              </header>

              <Section>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Degree Overview</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { label: 'Active Students', value: prog.activeStudents },
                    { label: 'Courses', value: prog.courses.length },
                    { label: 'Skills Covered', value: totalSkills() },
                  ].map((k) => (
                    <div
                      key={k.label}
                      className="rounded-xl border p-4 hover:shadow-lg hover:scale-[1.02] transition"
                    >
                      <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
                      <p className="text-2xl font-bold text-primary">{k.value}</p>
                    </div>
                  ))}
                </div>
              </Section>

              <Section>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-1.5 rounded-full bg-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Courses</h2>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full border bg-muted text-muted-foreground">
                    {prog.courses.length} courses
                  </span>
                  <Button
                    disabled={editingCourse !== null}
                    onClick={() => {
                      const nc: ProgrammeCourse = {
                        id: `draft-${Date.now()}`,
                        code: '',
                        name: '',
                        credits: 0,
                        year: 0,
                        skills: [],
                      };
                      setEditingCourse(nc);
                      setEditBuffer(nc);
                    }}
                  >
                    + Add Course
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        {['Code', 'Course Name', 'Year', 'Credits', 'Skills'].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))}
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground w-[260px]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseRows.map((course) => {
                        const isEd = editingCourse?.id === course.id;
                        const buf = editBuffer;
                        return (
                          <tr
                            key={course.id}
                            className={`border-t transition ${isEd ? 'bg-primary/5' : ''}`}
                          >
                            <td className="px-4 py-3">
                              {isEd ? (
                                <Input
                                  value={buf?.code || ''}
                                  onChange={(e) => setEditBuffer({ ...buf!, code: e.target.value })}
                                  placeholder="e.g. IT301"
                                  className="h-9 w-28 bg-background font-mono shadow-sm"
                                />
                              ) : (
                                <span className="font-mono text-xs text-muted-foreground">
                                  {course.code}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {isEd ? (
                                <Input
                                  value={buf?.name || ''}
                                  onChange={(e) => setEditBuffer({ ...buf!, name: e.target.value })}
                                  placeholder="Course name"
                                  className="h-9 min-w-52 bg-background shadow-sm"
                                />
                              ) : (
                                <button
                                  onClick={() => goToMapping(course)}
                                  className="font-medium text-sm text-primary hover:underline"
                                >
                                  {course.name}
                                </button>
                              )}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {isEd ? (
                                <Input
                                  type="number"
                                  min={1}
                                  value={buf?.year || ''}
                                  onChange={(e) =>
                                    setEditBuffer({
                                      ...buf!,
                                      year: e.target.value === '' ? 0 : Number(e.target.value),
                                    })
                                  }
                                  placeholder="Year"
                                  className="h-9 w-20 bg-background shadow-sm"
                                />
                              ) : (
                                `Year ${course.year}`
                              )}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {isEd ? (
                                <Input
                                  type="number"
                                  min={1}
                                  value={buf?.credits || ''}
                                  onChange={(e) =>
                                    setEditBuffer({
                                      ...buf!,
                                      credits: e.target.value === '' ? 0 : Number(e.target.value),
                                    })
                                  }
                                  placeholder="Credits"
                                  className="h-9 w-24 bg-background shadow-sm"
                                />
                              ) : (
                                `${course.credits} cr`
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {isEd && buf ? (
                                <div className="min-w-64 space-y-2">
                                  <div className="flex min-h-8 flex-wrap gap-1.5">
                                    {buf.skills.map((skillId) => {
                                      const skill = getSkill(allSkills, skillId);
                                      const style = skill ? catStyle[skill.category] : '';
                                      return skill ? (
                                        <span
                                          key={skillId}
                                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${style}`}
                                        >
                                          {skill.name}
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setEditBuffer({
                                                ...buf,
                                                skills: buf.skills.filter((s) => s !== skillId),
                                              })
                                            }
                                            className="flex size-4 cursor-pointer items-center justify-center rounded-full hover:bg-black/5"
                                          >
                                            <X className="size-3" />
                                          </button>
                                        </span>
                                      ) : null;
                                    })}
                                    {buf.skills.length === 0 && (
                                      <span className="self-center text-xs italic text-muted-foreground">
                                        No skills selected
                                      </span>
                                    )}
                                  </div>
                                  <Select
                                    value=""
                                    onValueChange={(skillId) =>
                                      setEditBuffer({ ...buf, skills: [...buf.skills, skillId] })
                                    }
                                  >
                                    <SelectTrigger className="h-9 w-full bg-background shadow-sm">
                                      <SelectValue placeholder="Add a skill" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {allSkills
                                        .filter((s) => !buf.skills.includes(s.id))
                                        .map((skill) => (
                                          <SelectItem key={skill.id} value={skill.id}>
                                            {skill.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-1.5">
                                  {course.skills.slice(0, 3).map((sid) => {
                                    const sk = getSkill(allSkills, sid);
                                    return sk ? (
                                      <span
                                        key={sid}
                                        className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-foreground/80"
                                      >
                                        {sk.name}
                                      </span>
                                    ) : null;
                                  })}
                                  {course.skills.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{course.skills.length - 3}
                                    </span>
                                  )}
                                  {course.skills.length === 0 && (
                                    <span className="text-xs italic text-muted-foreground">
                                      None mapped
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 w-[260px]">
                              <div className="flex justify-end gap-2">
                                {isEd ? (
                                  <>
                                    <Button
                                      onClick={saveEdit}
                                      disabled={!canSaveCourse}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setEditingCourse(null);
                                        setEditBuffer(null);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setEditingCourse(course);
                                        setEditBuffer({ ...course, skills: [...course.skills] });
                                      }}
                                      disabled={editingCourse !== null}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="secondary"
                                      onClick={() => goToMapping(course)}
                                      disabled={editingCourse !== null}
                                    >
                                      Map Skills
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      disabled={editingCourse !== null}
                                      onClick={() =>
                                        setConfirmDelete({ courseId: course.id, programId: prog.id })
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Section>

              {/* Curriculum Matrix */}
              <Section>
                <SectionHeader
                  title="Curriculum Map"
                  subtitle="Skill coverage across all courses in this Degree"
                />
                <div className="rounded-xl border overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left border-r text-sm font-medium w-44 bg-muted/50 text-muted-foreground">
                          Skill / Course
                        </th>
                        {prog.courses.map((co) => (
                          <th
                            key={co.id}
                            className="px-3 py-3 text-center font-medium bg-muted/50 text-muted-foreground min-w-[100px]"
                          >
                            <button onClick={() => goToMapping(co)} className="text-primary hover:underline">
                              {co.name}
                            </button>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allSkills
                        .filter((sk) => prog.courses.some((co) => co.skills.includes(sk.id)))
                        .map((sk, ri) => (
                          <tr key={sk.id} className={ri % 2 === 0 ? 'bg-muted/20' : ''}>
                            <td className="px-4 py-2.5 border-r font-medium whitespace-nowrap text-foreground">
                              <span className="inline-flex items-center gap-1.5">
                                <span
                                  className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                    sk.category === 'technical'
                                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                  }`}
                                >
                                  {sk.category === 'technical' ? 'tech' : 'soft'}
                                </span>
                                {sk.name}
                              </span>
                            </td>
                            {prog.courses.map((co) => (
                              <td key={co.id} className="py-2.5 text-center">
                                {co.skills.includes(sk.id) ? (
                                  <span className="inline-block w-4 h-4 rounded-full bg-primary" />
                                ) : (
                                  <span className="inline-block w-4 h-4 rounded-full bg-muted/50" />
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            </motion.div>
          )}

          {/* ─── SKILL MAPPING VIEW ──────────────────────────── */}
          {view === 'mapping' && prog && liveCourse && (
            <motion.div
              key="mapping"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              <header className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {liveCourse.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {prog.name} · {liveCourse.code} · Year {liveCourse.year} · {liveCourse.credits} credits
                </p>
              </header>

              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* LEFT */}
                <div className="space-y-6">
                  <Section>
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-foreground">Course Overview</h2>
                      <span className="text-xs px-3 py-1 rounded-full border bg-muted text-muted-foreground">
                        {liveCourse.code}
                      </span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      {[
                        { label: 'Mapped Skills', value: liveCourse.skills.length },
                        { label: 'Credits', value: liveCourse.credits },
                        { label: 'Year Level', value: liveCourse.year },
                      ].map((k) => (
                        <div key={k.label} className="rounded-xl border p-4">
                          <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
                          <p className="text-2xl font-bold text-primary">{k.value}</p>
                        </div>
                      ))}
                    </div>
                  </Section>

                  <Section>
                    <SectionHeader
                      title="Skills Intelligence"
                      subtitle="Click any skill to map or unmap it from this course"
                    />

                    <div className="flex gap-2 flex-wrap items-center">
                      <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                        <input
                          placeholder="Search skills…"
                          value={searchSkill}
                          onChange={(e) => setSearchSkill(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl text-sm bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                        />
                      </div>
                      {['all', 'technical', 'soft'].map((cat) => {
                        const active = filterCat === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setFilterCat(cat)}
                            className={`px-3 py-2 rounded-xl border text-xs font-medium transition ${
                              active
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'bg-muted border-border text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </button>
                        );
                      })}
                      <Button
                        onClick={() => setAddSkillOpen(true)}
                      >
                        <Plus className="size-3.5" />
                        Add Skill
                      </Button>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                      {/* Available Skills */}
                      <div className="rounded-xl border p-4 hover:shadow-md transition">
                        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">
                          {filteredSkills.length} available skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {filteredSkills.map((sk) => {
                            const mapped = liveCourse.skills.includes(sk.id);
                            const style = catStyle[sk.category];
                            return (
                              <motion.button
                                key={sk.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleSkill(sk.id, liveCourse.id, prog.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                                  mapped
                                    ? 'bg-primary/10 border-primary text-primary'
                                    : 'bg-muted border-border text-foreground hover:bg-muted/80'
                                }`}
                              >
                                {mapped && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                {sk.name}
                                <span
                                  className={`text-xs px-1 rounded ${
                                    sk.category === 'technical'
                                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                  }`}
                                >
                                  {sk.category === 'technical' ? 'T' : 'S'}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Mapped Skills */}
                      <div className="rounded-xl border p-4 hover:shadow-md transition">
                        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">
                          Mapped skills ({liveCourse.skills.length})
                        </p>
                        {liveCourse.skills.length === 0 ? (
                          <p className="text-sm italic text-muted-foreground">No skills mapped yet.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {liveCourse.skills.map((skillId) => {
                              const skill = getSkill(allSkills, skillId);
                              const style = skill ? catStyle[skill.category] : '';
                              return skill ? (
                                <div
                                  key={skillId}
                                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${style}`}
                                >
                                  {skill.name}
                                  <button
                                    type="button"
                                    onClick={() => toggleSkill(skillId, liveCourse.id, prog.id)}
                                    className="ml-0.5 font-bold hover:opacity-70"
                                    aria-label={`Unmap ${skill.name}`}
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </Section>
                </div>

                {/* RIGHT PANEL */}
                <div className="space-y-5">
                  <Section>
                    <SectionHeader title="Category Breakdown" />
                    {(() => {
                      const techCount = liveCourse.skills.filter(
                        (sid) => getSkill(allSkills, sid)?.category === 'technical'
                      ).length;
                      const softCount = liveCourse.skills.filter(
                        (sid) => getSkill(allSkills, sid)?.category === 'soft'
                      ).length;
                      const totalSelected = techCount + softCount;
                      const techPct = totalSelected ? Math.round((techCount / totalSelected) * 100) : 0;
                      const softPct = totalSelected ? Math.round((softCount / totalSelected) * 100) : 0;
                      const categories = [
                        { key: 'technical', label: 'Technical Skills', count: techCount, pct: techPct },
                        { key: 'soft', label: 'Soft Skills', count: softCount, pct: softPct },
                      ] as const;
                      return categories.map((cat) => (
                        <div key={cat.key} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className={`font-medium ${
                              cat.key === 'technical' ? 'text-blue-700 dark:text-blue-300' : 'text-emerald-700 dark:text-emerald-300'
                            }`}>
                              {cat.label}
                            </span>
                            <span className="text-muted-foreground">
                              {cat.count} skills · {cat.pct}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden bg-muted">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${cat.pct}%` }}
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                              className={`h-full rounded-full ${
                                cat.key === 'technical' ? 'bg-blue-500' : 'bg-emerald-500'
                              }`}
                            />
                          </div>
                        </div>
                      ));
                    })()}
                  </Section>

                  <Section>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-1.5 rounded-full bg-primary" />
                        <h2 className="text-base font-semibold text-foreground">All Courses</h2>
                      </div>
                      <p className="text-xs pl-4 text-muted-foreground">Click to switch course</p>
                    </div>
                    <div className="space-y-2">
                      {prog.courses.map((co) => {
                        const active = co.id === liveCourse.id;
                        return (
                          <button
                            key={co.id}
                            onClick={() => goToMapping(co)}
                            className={`w-full flex justify-between items-center px-3 py-2.5 rounded-xl border text-left text-sm transition ${
                              active
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-border bg-muted/30 text-foreground hover:bg-muted/50'
                            }`}
                          >
                            <div>
                              <p className={`font-medium text-xs ${active ? 'text-primary' : ''}`}>
                                {co.name}
                              </p>
                              <p className="text-xs text-muted-foreground">{co.code}</p>
                            </div>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                co.skills.length > 0 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {co.skills.length} skills
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setView('courses')}
                      className="w-full py-2 rounded-xl border text-xs font-medium transition hover:bg-muted/50"
                    >
                      ← Back to Courses
                    </button>
                  </Section>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Confirm Delete Modal ── */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-foreground mb-2">Delete Course?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  deleteCourse(confirmDelete.courseId, confirmDelete.programId);
                  setConfirmDelete(null);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Skill Modal ── */}
      <AnimatePresence>
        {addSkillOpen && (
          <AddSkillModal
            open={addSkillOpen}
            onClose={() => setAddSkillOpen(false)}
            onAdd={handleAddSkill}
            existingSkills={allSkills}
          />
        )}
      </AnimatePresence>
    </div>
  );
}