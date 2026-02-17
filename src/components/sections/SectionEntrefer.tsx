import { useMachine } from '@/contexts/MachineContext';
import { LaTeX } from '@/components/LaTeX';
import { ResultValue } from '@/components/ResultValue';

export function SectionEntrefer() {
  const { results, isCalculated } = useMachine();
  const r = results.entrefer;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-card border border-border rounded-lg p-5 section-card">
        <h3 className="text-base font-bold text-card-foreground mb-4">4. Entrefer</h3>

        <div className="mb-4 space-y-2 bg-muted/30 rounded-md p-4 border border-border/50">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Formules</p>
          <LaTeX math="\delta \approx (0.01 \sim 0.015) \cdot \tau_p" display />
          <LaTeX math="k_\delta = \frac{\tau_{z1}}{\tau_{z1} - \gamma \cdot \delta}" display />
          <LaTeX math="\gamma = \frac{(b_{enc}/\delta)^2}{5 + b_{enc}/\delta}" display />
        </div>

        {isCalculated && r && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ResultValue label="Entrefer (δ)" value={r.delta * 1000} unit="mm" variant="success" />
            <ResultValue label="Coefficient de Carter (kδ)" value={r.kdelta} />
          </div>
        )}

        {!isCalculated && (
          <p className="text-sm text-muted-foreground italic">Cliquez sur « Calculer Tout ».</p>
        )}
      </div>
    </div>
  );
}
