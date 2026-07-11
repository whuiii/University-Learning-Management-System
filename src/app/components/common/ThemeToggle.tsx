import { Moon, Sun, Eye } from "lucide-react";
import type { Theme } from "../../types";

export function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  const modes: { id: Theme; icon: React.ElementType; label: string }[] = [
    { id: "dark", icon: Moon, label: "Dark" },
    { id: "light", icon: Sun, label: "Light" },
    { id: "eye", icon: Eye, label: "Eye Care" },
  ];
  return (
    <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          title={m.label}
          className={`p-2 rounded-lg transition-all ${
            theme === m.id
              ? "bg-card text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <m.icon size={14} />
        </button>
      ))}
    </div>
  );
}