import { useMachine } from '@/contexts/MachineContext';
import { LaTeX } from '@/components/LaTeX';
import { ResultValue } from '@/components/ResultValue';

export function SectionDimensions() {
  const { results, isCalculated } = useMachine();
  const r = results.dimensions;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-card border border-border rounded-lg p-5 section-card">
        <h3 className="text-base font-bold text-card-foreground mb-4">2. Dimensions Principales</h3>

        <div className="mb-4 space-y-2 bg-muted/30 rounded-md p-4 border border-border/50">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Formules</p>
          <LaTeX math="C_a = \pi^2 \sqrt{2} \cdot k_E \cdot \alpha_i \cdot k_{w1} \cdot A \cdot B_{\delta n}" display />
          <LaTeX math="D^2 L = \frac{S_n}{C_a \cdot \frac{n_n}{60}}" display />
          <LaTeX math="\tau_p = \frac{\pi D}{2p} \quad ; \quad \lambda = \frac{L}{\tau_p}" display />
        </div>

        {isCalculated && r && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ResultValue label="Diamètre d'alésage (D)" value={r.D} unit="m" variant="success" />
            <ResultValue label="Diamètre extérieur (Da)" value={r.Da} unit="m" />
            <ResultValue label="Longueur active (L)" value={r.L} unit="m" />
            <ResultValue label="Pas polaire (τp)" value={r.tau_p} unit="m" />
            <ResultValue label="Rapport λ = L/τp" value={r.lambda} />
            <ResultValue label="Charge linéique (A)" value={r.A} unit="A/m" />
            <ResultValue label="Induction entrefer (Bδn)" value={r.Bdelta_n} unit="T" />
            <ResultValue label="Coeff. forme (αi)" value={r.alpha_i} />
            <ResultValue label="Facteur bobinage (kw1)" value={r.kw1} />
            <ResultValue label="Rapport kE" value={r.kE} />
          </div>
        )}

        {!isCalculated && (
          <p className="text-sm text-muted-foreground italic">Cliquez sur « Calculer Tout ».</p>
        )}
      </div>
    </div>
  );
}
