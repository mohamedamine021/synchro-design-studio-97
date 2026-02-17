import { useMachine } from '@/contexts/MachineContext';
import { ResultValue } from '@/components/ResultValue';
import { FileText } from 'lucide-react';

export function SectionResume() {
  const { results, isCalculated, cdc } = useMachine();

  if (!isCalculated) {
    return (
      <div className="animate-fade-in bg-card border border-border rounded-lg p-5">
        <h3 className="text-base font-bold text-card-foreground mb-2">10. Résumé Final</h3>
        <p className="text-sm text-muted-foreground italic">Effectuez les calculs pour voir le résumé complet.</p>
      </div>
    );
  }

  const { nominales: n, dimensions: d, enroulement: e, entrefer: ent, poles: p, reactance: r, fmmCharge: fmm, excitation: ex } = results;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-card border border-border rounded-lg p-5 section-card">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-base font-bold text-card-foreground">10. Résumé Final — Rapport Complet</h3>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-bold text-primary mb-2">Cahier des charges</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <span>Pn = {cdc.Pn} kW</span>
            <span>Unl = {cdc.Unl} V</span>
            <span>cos φ = {cdc.cosPhi}</span>
            <span>f = {cdc.f} Hz</span>
            <span>nn = {cdc.nn} tr/min</span>
            <span>Arbre: {cdc.typeArbre}</span>
          </div>
        </div>

        {n && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-card-foreground mb-2 border-b border-border pb-1">Valeurs Nominales</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
              <ResultValue label="p" value={n.p} />
              <ResultValue label="Sn" value={n.Sn} unit="kVA" />
              <ResultValue label="In" value={n.In} unit="A" />
            </div>
          </div>
        )}

        {d && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-card-foreground mb-2 border-b border-border pb-1">Dimensions</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
              <ResultValue label="D" value={d.D} unit="m" variant="success" />
              <ResultValue label="L" value={d.L} unit="m" />
              <ResultValue label="τp" value={d.tau_p} unit="m" />
            </div>
          </div>
        )}

        {e && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-card-foreground mb-2 border-b border-border pb-1">Stator</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
              <ResultValue label="Z1" value={e.Z1} />
              <ResultValue label="w1" value={e.w1} />
              <ResultValue label="Nc" value={e.Nc} />
            </div>
          </div>
        )}

        {ent && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-card-foreground mb-2 border-b border-border pb-1">Entrefer</h4>
            <div className="grid grid-cols-2 gap-1.5">
              <ResultValue label="δ" value={ent.delta * 1000} unit="mm" />
              <ResultValue label="kδ" value={ent.kdelta} />
            </div>
          </div>
        )}

        {p && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-card-foreground mb-2 border-b border-border pb-1">Rotor</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
              <ResultValue label="bp" value={p.bp} unit="m" />
              <ResultValue label="hp" value={p.hp} unit="m" />
              <ResultValue label="Bp" value={p.Bp} unit="T" />
            </div>
          </div>
        )}

        {r && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-card-foreground mb-2 border-b border-border pb-1">Réactances</h4>
            <div className="grid grid-cols-2 gap-1.5">
              <ResultValue label="xd" value={r.xd} unit="pu" variant="success" />
              <ResultValue label="xq" value={r.xq} unit="pu" variant="success" />
            </div>
          </div>
        )}

        {fmm && ex && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-card-foreground mb-2 border-b border-border pb-1">Excitation</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
              <ResultValue label="Fex" value={fmm.Fex} unit="A" variant="success" />
              <ResultValue label="wex" value={ex.wex} />
              <ResultValue label="Iex" value={ex.Iex} unit="A" />
              <ResultValue label="Pex" value={ex.Pex} unit="W" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
