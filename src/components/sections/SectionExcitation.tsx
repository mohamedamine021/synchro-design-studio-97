import { useMachine } from '@/contexts/MachineContext';
import { LaTeX } from '@/components/LaTeX';
import { ResultValue } from '@/components/ResultValue';

export function SectionExcitation() {
  const { results, isCalculated } = useMachine();
  const r = results.excitation;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-card border border-border rounded-lg p-5 section-card">
        <h3 className="text-base font-bold text-card-foreground mb-4">9. Enroulement d'Excitation et Dispositif d'Excitation</h3>

        <div className="mb-4 space-y-2 bg-muted/30 rounded-md p-4 border border-border/50">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Formules</p>
          <LaTeX math="F_{ex} = w_{ex} \cdot I_{ex}" display />
          <LaTeX math="S_{ex} = \frac{I_{ex}}{J_{ex}}" display />
          <LaTeX math="P_{ex} = R_{ex} \cdot I_{ex}^2" display />
        </div>

        {isCalculated && r && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ResultValue label="Spires excitation/pôle (wex)" value={r.wex} variant="success" />
            <ResultValue label="Courant excitation (Iex)" value={r.Iex} unit="A" />
            <ResultValue label="Section conducteur (Sex)" value={r.Sex} unit="mm²" />
            <ResultValue label="Puissance excitation (Pex)" value={r.Pex} unit="W" />
          </div>
        )}

        {!isCalculated && (
          <p className="text-sm text-muted-foreground italic">Cliquez sur « Calculer Tout ».</p>
        )}
      </div>
    </div>
  );
}
