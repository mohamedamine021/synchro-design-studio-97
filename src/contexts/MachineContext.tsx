import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CahierDesCharges, CalculationResults, SectionId } from '@/types/machine';
import { calculerTout } from '@/lib/calculations';

interface MachineContextType {
  cdc: CahierDesCharges;
  setCdc: (cdc: CahierDesCharges) => void;
  results: CalculationResults;
  activeSection: SectionId;
  setActiveSection: (s: SectionId) => void;
  isCalculated: boolean;
  calculer: () => void;
  overrides: Record<string, Record<string, number>>;
  setOverride: (section: string, key: string, value: number) => void;
}

const defaultCdc: CahierDesCharges = {
  Pn: 500,
  Unl: 6300,
  cosPhi: 0.8,
  f: 50,
  nn: 750,
  typeArbre: 'horizontal',
  ventilation: 'radiale',
  typeExcitation: 'bagues',
};

const emptyResults: CalculationResults = {
  nominales: null,
  dimensions: null,
  enroulement: null,
  entrefer: null,
  poles: null,
  caracteristique: null,
  reactance: null,
  fmmCharge: null,
  excitation: null,
};

const MachineContext = createContext<MachineContextType | null>(null);

export function MachineProvider({ children }: { children: ReactNode }) {
  const [cdc, setCdc] = useState<CahierDesCharges>(defaultCdc);
  const [results, setResults] = useState<CalculationResults>(emptyResults);
  const [activeSection, setActiveSection] = useState<SectionId>('nominales');
  const [isCalculated, setIsCalculated] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, Record<string, number>>>({});

  const setOverride = useCallback((section: string, key: string, value: number) => {
    setOverrides(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  }, []);

  const calculer = useCallback(() => {
    try {
      const result = calculerTout(cdc, {
        dimensions: overrides.dimensions,
        enroulement: overrides.enroulement,
        entrefer: overrides.entrefer,
        poles: overrides.poles,
        excitation: overrides.excitation,
      });
      setResults(result);
      setIsCalculated(true);
    } catch (e) {
      console.error('Erreur de calcul:', e);
    }
  }, [cdc, overrides]);

  return (
    <MachineContext.Provider value={{
      cdc, setCdc, results, activeSection, setActiveSection,
      isCalculated, calculer, overrides, setOverride,
    }}>
      {children}
    </MachineContext.Provider>
  );
}

export function useMachine() {
  const ctx = useContext(MachineContext);
  if (!ctx) throw new Error('useMachine must be used within MachineProvider');
  return ctx;
}
