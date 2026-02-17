import { useMachine } from '@/contexts/MachineContext';
import { LaTeX } from '@/components/LaTeX';
import { ResultValue } from '@/components/ResultValue';

export function SectionReactance() {
  const { results, isCalculated } = useMachine();
  const r = results.reactance;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-card border border-border rounded-lg p-5 section-card">
        <h3 className="text-base font-bold text-card-foreground mb-4">7. Réactance Inductive de Dispersion</h3>

        <div className="mb-4 space-y-2 bg-muted/30 rounded-md p-4 border border-border/50">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Formules</p>
          <LaTeX math="x_d = x_{ad} + x_\sigma" display />
          <LaTeX math="x_q \approx 0.6 \cdot x_{ad} + x_\sigma" display />
          <LaTeX math="x_{ad} = \frac{2\mu_0 f L \tau_p (w_1 k_{w1})^2 k_{ad}}{\pi p \cdot \delta \cdot k_\delta \cdot Z_{base}}" display />
        </div>

        {isCalculated && r && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ResultValue label="Réactance magnétisation (x_ad)" value={r.x_ad} unit="pu" />
            <ResultValue label="Réactance dispersion (x_σ)" value={r.x_sigma} unit="pu" />
            <ResultValue label="Réactance synchrone d (xd)" value={r.xd} unit="pu" variant="success" />
            <ResultValue label="Réactance synchrone q (xq)" value={r.xq} unit="pu" variant="success" />
          </div>
        )}

        {!isCalculated && (
          <p className="text-sm text-muted-foreground italic">Cliquez sur « Calculer Tout ».</p>
        )}
      </div>
    </div>
  );
}
