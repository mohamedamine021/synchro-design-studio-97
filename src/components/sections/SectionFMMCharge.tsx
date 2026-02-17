import { useMachine } from '@/contexts/MachineContext';
import { LaTeX } from '@/components/LaTeX';
import { ResultValue } from '@/components/ResultValue';

export function SectionFMMCharge() {
  const { results, isCalculated } = useMachine();
  const r = results.fmmCharge;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-card border border-border rounded-lg p-5 section-card">
        <h3 className="text-base font-bold text-card-foreground mb-4">8. Force Magnétomotrice d'Excitation en Charge</h3>

        <div className="mb-4 space-y-2 bg-muted/30 rounded-md p-4 border border-border/50">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Formules</p>
          <LaTeX math="F_{ad} = \frac{m\sqrt{2} \cdot w_1 \cdot k_{w1} \cdot I_n \cdot k_d}{\pi \cdot p}" display />
          <LaTeX math="F_{ex} = \sqrt{(F_0 + F_{ad}\sin\varphi)^2 + (F_{aq}\cos\varphi)^2}" display />
        </div>

        {isCalculated && r && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ResultValue label="FMM réaction induit axe d (Fad)" value={r.Fad} unit="A" />
            <ResultValue label="FMM réaction induit axe q (Faq)" value={r.Faq} unit="A" />
            <ResultValue label="FMM excitation en charge (Fex)" value={r.Fex} unit="A" variant="success" />
          </div>
        )}

        {!isCalculated && (
          <p className="text-sm text-muted-foreground italic">Cliquez sur « Calculer Tout ».</p>
        )}
      </div>
    </div>
  );
}
