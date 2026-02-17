import { useMachine } from '@/contexts/MachineContext';
import { LaTeX } from '@/components/LaTeX';
import { ResultValue } from '@/components/ResultValue';

export function SectionPoles() {
  const { results, isCalculated } = useMachine();
  const r = results.poles;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-card border border-border rounded-lg p-5 section-card">
        <h3 className="text-base font-bold text-card-foreground mb-4">5. Pôles et Culasse Rotorique</h3>

        <div className="mb-4 space-y-2 bg-muted/30 rounded-md p-4 border border-border/50">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Formules</p>
          <LaTeX math="b_p = \alpha_p \cdot \tau_p" display />
          <LaTeX math="B_p = \frac{\Phi}{b_p \cdot L \cdot k_{emp}}" display />
          <LaTeX math="h_{cr} = \frac{\Phi}{2 \cdot L \cdot B_{cr}}" display />
        </div>

        {isCalculated && r && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ResultValue label="Coeff. arc polaire (αp)" value={r.alpha_p} />
            <ResultValue label="Largeur pôle (bp)" value={r.bp} unit="m" variant="success" />
            <ResultValue label="Hauteur pôle (hp)" value={r.hp} unit="m" />
            <ResultValue label="Induction pôle (Bp)" value={r.Bp} unit="T" variant={r.Bp > 1.8 ? 'warning' : 'primary'} />
            <ResultValue label="Hauteur culasse rotor (hcr)" value={r.hcr} unit="m" />
            <ResultValue label="Induction culasse rotor (Bcr)" value={r.Bcr} unit="T" />
          </div>
        )}

        {!isCalculated && (
          <p className="text-sm text-muted-foreground italic">Cliquez sur « Calculer Tout ».</p>
        )}
      </div>
    </div>
  );
}
