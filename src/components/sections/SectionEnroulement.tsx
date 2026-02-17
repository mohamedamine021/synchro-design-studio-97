import { useMachine } from '@/contexts/MachineContext';
import { LaTeX } from '@/components/LaTeX';
import { ResultValue } from '@/components/ResultValue';

export function SectionEnroulement() {
  const { results, isCalculated } = useMachine();
  const r = results.enroulement;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-card border border-border rounded-lg p-5 section-card">
        <h3 className="text-base font-bold text-card-foreground mb-4">3. Enroulements, Encoches et Culasse du Stator</h3>

        <div className="mb-4 space-y-2 bg-muted/30 rounded-md p-4 border border-border/50">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Formules</p>
          <LaTeX math="Z_1 = 2p \cdot m \cdot q_1" display />
          <LaTeX math="\tau_{z1} = \frac{\pi D}{Z_1}" display />
          <LaTeX math="w_1 = \frac{E}{4.44 \cdot f \cdot k_{w1} \cdot \Phi}" display />
          <LaTeX math="\Phi = \alpha_i \cdot \tau_p \cdot L \cdot B_{\delta n}" display />
          <LaTeX math="N_c = \frac{2 m \cdot w_1 \cdot a}{Z_1}" display />
        </div>

        {isCalculated && r && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ResultValue label="Encoches/pôle/phase (q1)" value={r.q1} />
            <ResultValue label="Nombre total d'encoches (Z1)" value={r.Z1} />
            <ResultValue label="Pas de bobinage (y)" value={r.y} unit="encoches" />
            <ResultValue label="Pas dentaire (τz1)" value={r.tau_z1} unit="m" />
            <ResultValue label="Spires par phase (w1)" value={r.w1} variant="success" />
            <ResultValue label="Conducteurs/encoche (Nc)" value={r.Nc} />
            <ResultValue label="Courant de phase (Iph)" value={r.Iph} unit="A" />
            <ResultValue label="Section conducteur (Sc)" value={r.Sc} unit="mm²" />
            <ResultValue label="Largeur dent (bz1)" value={r.bz1} unit="m" />
            <ResultValue label="Largeur encoche (bc1)" value={r.bc1} unit="m" />
            <ResultValue label="Hauteur encoche (hc1)" value={r.hc1} unit="m" />
            <ResultValue label="Hauteur culasse (hcs)" value={r.hcs} unit="m" />
            <ResultValue label="Induction dent (Bz1)" value={r.Bz1} unit="T" variant={r.Bz1 > 1.8 ? 'warning' : 'primary'} />
            <ResultValue label="Induction culasse (Bcs)" value={r.Bcs} unit="T" variant={r.Bcs > 1.6 ? 'warning' : 'primary'} />
          </div>
        )}

        {!isCalculated && (
          <p className="text-sm text-muted-foreground italic">Cliquez sur « Calculer Tout ».</p>
        )}
      </div>
    </div>
  );
}
