import { 
  Zap, Ruler, Codesandbox, Circle, Hexagon, 
  BarChart3, Activity, Magnet, Settings2, FileText 
} from 'lucide-react';
import { useMachine } from '@/contexts/MachineContext';
import type { SectionId, SectionConfig } from '@/types/machine';

const sections: SectionConfig[] = [
  { id: 'nominales', label: 'Valeurs nominales', shortLabel: 'Nominales', icon: 'zap', numero: 1 },
  { id: 'dimensions', label: 'Dimensions principales', shortLabel: 'Dimensions', icon: 'ruler', numero: 2 },
  { id: 'enroulement', label: 'Enroulements stator', shortLabel: 'Stator', icon: 'codesandbox', numero: 3 },
  { id: 'entrefer', label: 'Entrefer', shortLabel: 'Entrefer', icon: 'circle', numero: 4 },
  { id: 'poles', label: 'Pôles et culasse rotor', shortLabel: 'Rotor', icon: 'hexagon', numero: 5 },
  { id: 'caracteristique', label: 'Caractéristique à vide', shortLabel: 'Carac. vide', icon: 'barChart', numero: 6 },
  { id: 'reactance', label: 'Réactance de dispersion', shortLabel: 'Réactance', icon: 'activity', numero: 7 },
  { id: 'fmmCharge', label: 'FMM d\'excitation en charge', shortLabel: 'FMM Charge', icon: 'magnet', numero: 8 },
  { id: 'excitation', label: 'Enroulement d\'excitation', shortLabel: 'Excitation', icon: 'settings', numero: 9 },
  { id: 'resume', label: 'Résumé Final', shortLabel: 'Résumé', icon: 'file', numero: 10 },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  zap: Zap, ruler: Ruler, codesandbox: Codesandbox, circle: Circle,
  hexagon: Hexagon, barChart: BarChart3, activity: Activity,
  magnet: Magnet, settings: Settings2, file: FileText,
};

export function AppSidebar() {
  const { activeSection, setActiveSection, isCalculated } = useMachine();

  return (
    <aside className="w-64 min-w-[256px] bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-sidebar-accent-foreground">Machine Synchrone</h2>
            <p className="text-[10px] text-sidebar-foreground">Alternateur Pôles Saillants</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <div className="px-3 mb-2">
          <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60 font-semibold">
            Sections de calcul
          </span>
        </div>
        {sections.map((section) => {
          const Icon = iconMap[section.icon] || Zap;
          const isActive = activeSection === section.id;
          const isAvailable = section.id === 'nominales' || isCalculated;
          
          return (
            <button
              key={section.id}
              onClick={() => isAvailable && setActiveSection(section.id)}
              disabled={!isAvailable}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all text-sm
                ${isActive 
                  ? 'bg-sidebar-accent text-sidebar-primary border-r-2 border-sidebar-primary' 
                  : isAvailable
                    ? 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/30 cursor-not-allowed'
                }`}
            >
              <span className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center shrink-0
                ${isActive ? 'bg-primary text-primary-foreground' : 'bg-sidebar-accent text-sidebar-foreground'}`}>
                {section.numero}
              </span>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{section.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <p className="text-[10px] text-sidebar-foreground/50 text-center">
          v1.0 — Concepteur MS
        </p>
      </div>
    </aside>
  );
}
