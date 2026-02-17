import { useMachine } from '@/contexts/MachineContext';
import { LaTeX } from '@/components/LaTeX';
import { ResultValue } from '@/components/ResultValue';

export function SectionNominales() {
  const { results, isCalculated } = useMachine();
  const r = results.nominales;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-card border border-border rounded-lg p-5 section-card">
        <h3 className="text-base font-bold text-card-foreground mb-4">1. Valeurs Nominales</h3>
        
        <div className="mb-4 space-y-2 bg-muted/30 rounded-md p-4 border border-border/50">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Formules</p>
          <LaTeX math="p = \frac{60 \cdot f}{n_n}" display />
          <LaTeX math="S_n = \frac{P_n}{\cos\varphi_n} \quad (kVA)" display />
          <LaTeX math="U_{ph} = \frac{U_{nl}}{\sqrt{3}}" display />
          <LaTeX math="I_n = \frac{S_n}{\sqrt{3} \cdot U_{nl}}" display />
          <LaTeX math="\Omega = \frac{2\pi n_n}{60} \quad ; \quad T_n = \frac{P_n}{\Omega}" display />
        </div>

        {isCalculated && r && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ResultValue label="Paires de pôles (p)" value={r.p} />
            <ResultValue label="Puissance apparente (Sn)" value={r.Sn} unit="kVA" />
            <ResultValue label="Tension de phase (Uph)" value={r.Uph} unit="V" />
            <ResultValue label="Courant nominal (In)" value={r.In} unit="A" />
            <ResultValue label="sin φn" value={r.sinPhi} />
            <ResultValue label="Vitesse angulaire (Ω)" value={r.Omega} unit="rad/s" />
            <ResultValue label="Couple nominal (Tn)" value={r.Tn} unit="N·m" variant="success" />
          </div>
        )}

        {!isCalculated && (
          <p className="text-sm text-muted-foreground italic">
            Cliquez sur « Calculer Tout » pour obtenir les résultats.
          </p>
        )}
      </div>
    </div>
  );
}
