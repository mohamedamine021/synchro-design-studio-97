import { useMachine } from '@/contexts/MachineContext';
import { LaTeX } from '@/components/LaTeX';
import { ResultValue } from '@/components/ResultValue';
import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export function SectionCaracteristique() {
  const { results, isCalculated } = useMachine();
  const r = results.caracteristique;
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !r) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: r.points.map(p => Math.round(p.excitation)),
        datasets: [{
          label: 'U/Un (%)',
          data: r.points.map(p => p.tension),
          borderColor: 'hsl(215, 80%, 55%)',
          backgroundColor: 'hsla(215, 80%, 55%, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'hsl(215, 80%, 55%)',
          pointRadius: 4,
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Caractéristique à vide E₀ = f(F₀)',
            color: 'hsl(220, 15%, 70%)',
            font: { size: 14, weight: 'bold' },
          },
          legend: { labels: { color: 'hsl(220, 15%, 70%)' } },
        },
        scales: {
          x: {
            title: { display: true, text: 'FMM (A)', color: 'hsl(220, 10%, 55%)' },
            ticks: { color: 'hsl(220, 10%, 55%)' },
            grid: { color: 'hsla(220, 10%, 50%, 0.1)' },
          },
          y: {
            title: { display: true, text: 'U/Un (%)', color: 'hsl(220, 10%, 55%)' },
            ticks: { color: 'hsl(220, 10%, 55%)' },
            grid: { color: 'hsla(220, 10%, 50%, 0.1)' },
          },
        },
      },
    });

    return () => { chartInstance.current?.destroy(); };
  }, [r]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-card border border-border rounded-lg p-5 section-card">
        <h3 className="text-base font-bold text-card-foreground mb-4">6. Caractéristique à Vide</h3>

        <div className="mb-4 space-y-2 bg-muted/30 rounded-md p-4 border border-border/50">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Formules</p>
          <LaTeX math="F_0 = F_\delta + F_{z1} + F_{cs} + F_p + F_{cr}" display />
          <LaTeX math="F_\delta = \frac{B_\delta \cdot \delta \cdot k_\delta}{\mu_0}" display />
        </div>

        {isCalculated && r && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              <ResultValue label="FMM entrefer (Fδ)" value={r.F_delta} unit="A" />
              <ResultValue label="FMM dent stator (Fz1)" value={r.F_z1} unit="A" />
              <ResultValue label="FMM culasse stator (Fcs)" value={r.F_cs} unit="A" />
              <ResultValue label="FMM pôle (Fp)" value={r.F_p} unit="A" />
              <ResultValue label="FMM culasse rotor (Fcr)" value={r.F_cr} unit="A" />
              <ResultValue label="FMM totale à vide (F0)" value={r.F0} unit="A" variant="success" />
            </div>

            <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
              <canvas ref={chartRef} />
            </div>
          </>
        )}

        {!isCalculated && (
          <p className="text-sm text-muted-foreground italic">Cliquez sur « Calculer Tout ».</p>
        )}
      </div>
    </div>
  );
}
