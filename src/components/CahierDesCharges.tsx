import { useMachine } from '@/contexts/MachineContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Zap } from 'lucide-react';
import type { CahierDesCharges } from '@/types/machine';

export function CahierDesChargesPanel() {
  const { cdc, setCdc, calculer, isCalculated } = useMachine();

  const update = (key: keyof CahierDesCharges, value: string | number) => {
    setCdc({ ...cdc, [key]: typeof cdc[key] === 'number' ? Number(value) : value } as CahierDesCharges);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-card-foreground">Cahier des charges</h3>
        </div>
        <Button onClick={calculer} size="sm" className="gap-1.5 h-8 text-xs">
          <Calculator className="w-3.5 h-3.5" />
          {isCalculated ? 'Recalculer Tout' : 'Calculer Tout'}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <Field label="Pn (kW)" value={cdc.Pn} onChange={v => update('Pn', v)} />
        <Field label="Unl (V)" value={cdc.Unl} onChange={v => update('Unl', v)} />
        <Field label="cos φn" value={cdc.cosPhi} onChange={v => update('cosPhi', v)} step={0.01} />
        <Field label="f (Hz)" value={cdc.f} onChange={v => update('f', v)} />
        <Field label="nn (tr/min)" value={cdc.nn} onChange={v => update('nn', v)} />
        <div>
          <Label className="text-[11px] text-muted-foreground mb-1 block">Arbre</Label>
          <Select value={cdc.typeArbre} onValueChange={v => update('typeArbre', v)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="horizontal">Horizontal</SelectItem>
              <SelectItem value="vertical">Vertical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[11px] text-muted-foreground mb-1 block">Ventilation</Label>
          <Select value={cdc.ventilation} onValueChange={v => update('ventilation', v)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="radiale">Radiale</SelectItem>
              <SelectItem value="axiale">Axiale</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[11px] text-muted-foreground mb-1 block">Excitation</Label>
          <Select value={cdc.typeExcitation} onValueChange={v => update('typeExcitation', v)}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bagues">Bagues</SelectItem>
              <SelectItem value="brushless">Brushless</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, step }: {
  label: string; value: number; onChange: (v: string) => void; step?: number;
}) {
  return (
    <div>
      <Label className="text-[11px] text-muted-foreground mb-1 block">{label}</Label>
      <Input
        type="number"
        value={value}
        step={step}
        onChange={e => onChange(e.target.value)}
        className="h-8 text-xs font-mono-eng"
      />
    </div>
  );
}
