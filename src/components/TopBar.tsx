import { Save, FolderOpen, FilePlus, FileDown, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function TopBar() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Initialize dark mode
  useState(() => {
    document.documentElement.classList.add('dark');
  });

  return (
    <header className="h-12 bg-topbar border-b border-sidebar-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-bold text-topbar-foreground tracking-tight">
          Concepteur de Machine Synchrone
        </h1>
        <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono-eng">
          v1.0
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 text-topbar-foreground hover:bg-sidebar-accent text-xs gap-1.5">
          <FilePlus className="w-3.5 h-3.5" /> Nouveau
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-topbar-foreground hover:bg-sidebar-accent text-xs gap-1.5">
          <FolderOpen className="w-3.5 h-3.5" /> Charger
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-topbar-foreground hover:bg-sidebar-accent text-xs gap-1.5">
          <Save className="w-3.5 h-3.5" /> Sauvegarder
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-topbar-foreground hover:bg-sidebar-accent text-xs gap-1.5">
          <FileDown className="w-3.5 h-3.5" /> PDF
        </Button>
        <div className="w-px h-5 bg-sidebar-border mx-1" />
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-topbar-foreground hover:bg-sidebar-accent" onClick={toggleTheme}>
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </Button>
      </div>
    </header>
  );
}
