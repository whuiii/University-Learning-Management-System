import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, Shield, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";
import { sans, serif } from "../../utils/helpers";
import type { Role } from "../../types";

export function LoginPage(){
  const [selectedRole, setSelectedRole] = useState<Role>("student");
  const { login } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const roles: { id: Role; label: string; icon: React.ElementType; desc: string; color: string }[] = [
    { id: "student", label: "Student", icon: BookOpen, desc: "Access courses & grades", color: "#C4582A" },
    { id: "lecturer", label: "Lecturer", icon: GraduationCap, desc: "Manage courses & grading", color: "#4A8A5C" },
    { id: "admin", label: "Admin", icon: Shield, desc: "System & user management", color: "#4470B4" },
  ];

  const credentials: Record<Role, string> = {
    student: "ahmad.fariz@utn.edu.my",
    lecturer: "sarah.chen@utn.edu.my",
    admin: "siti.rahimah@utn.edu.my",
  };

  const handleLogin = () => {
    login(selectedRole);
    navigate("/");
  };

  return (
    <div className={`theme-${theme} min-h-screen flex bg-background`} style={{ fontFamily: sans }}>
      {/* Left panel */}
      <div className="hidden lg:flex w-[54%] flex-col justify-between p-14 border-r border-border relative overflow-hidden bg-card">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 right-16 w-48 h-48 rounded-full border border-primary/15" />
          <div className="absolute top-8 right-14 w-64 h-64 rounded-full border border-primary/8" />
          <div className="absolute bottom-24 left-8 w-20 h-20 border border-primary/20 rotate-12" />
          <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-primary/30 rounded-full" />
          <div className="absolute top-1/2 left-2/3 w-2 h-2 bg-accent/40 rounded-full" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap size={18} style={{ color: "var(--primary-foreground)" }} />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm leading-none" style={{ fontFamily: serif }}>UTN</p>
            <p className="text-[10px] text-muted-foreground tracking-wider mt-0.5">Universiti Teknologi Nusantara</p>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
            Learning Management System
          </p>
          <h1 className="text-5xl font-normal text-foreground leading-[1.15] mb-6" style={{ fontFamily: serif }}>
            Knowledge<br />
            <em className="not-italic" style={{ color: "var(--primary)" }}>begins</em><br />
            here.
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-sm mb-10 text-sm">
            A centralized platform for UTN's 8,400 students and 320 lecturers — courses, assessments, grades, and communication all in one place.
          </p>
          <div className="grid grid-cols-3 gap-6">
            {[["200+", "Active Courses"], ["8,400", "Students"], ["142%", "ROI (3-year)"]].map(([n, l]) => (
              <div key={l} className="border-t border-border pt-4">
                <p className="text-2xl font-light text-primary" style={{ fontFamily: serif }}>{n}</p>
                <p className="text-xs text-muted-foreground mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-start gap-3 max-w-sm">
          <div className="w-1 h-12 bg-primary/40 rounded-full mt-1 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed italic">
            "Education is the most powerful weapon which you can use to change the world."
            <span className="block mt-1 not-italic font-medium text-muted-foreground/70">— Nelson Mandela</span>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end p-5">
          <ThemeToggle theme={theme} onChange={setTheme} />
        </div>
        <div className="flex-1 flex items-center justify-center px-8 pb-10">
          <div className="w-full max-w-[360px]">
            <div className="flex lg:hidden items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <GraduationCap size={15} style={{ color: "var(--primary-foreground)" }} />
              </div>
              <span className="font-semibold text-foreground text-sm" style={{ fontFamily: serif }}>UTN Learning Portal</span>
            </div>

            <h2 className="text-3xl font-normal text-foreground mb-1" style={{ fontFamily: serif }}>Welcome back</h2>
            <p className="text-muted-foreground text-sm mb-8">Sign in to your university portal</p>

            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Sign in as</p>
            <div className="flex flex-col gap-2 mb-6">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                    selectedRole === r.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${r.color}22` }}
                  >
                    <r.icon size={16} style={{ color: r.color }} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${selectedRole === r.id ? "text-primary" : "text-foreground"}`}>
                      {r.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                  {selectedRole === r.id && <CheckCircle2 size={16} className="text-primary flex-shrink-0" />}
                </button>
              ))}
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Email</label>
                <input
                  key={selectedRole}
                  defaultValue={credentials[selectedRole]}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">Password</label>
                <input type="password" defaultValue="••••••••"
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full rounded-xl py-3.5 font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] bg-primary text-primary-foreground"
            >
              Sign In
            </button>

            <p className="text-center text-xs text-muted-foreground mt-5">
              Need help?{" "}
              <span className="text-primary cursor-pointer hover:underline">it-support@utn.edu.my</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}