import { TopBar } from '@/components/TopBar';
import { AppSidebar } from '@/components/AppSidebar';
import { CahierDesChargesPanel } from '@/components/CahierDesCharges';
import { MachineProvider, useMachine } from '@/contexts/MachineContext';
import { SectionNominales } from '@/components/sections/SectionNominales';
import { SectionDimensions } from '@/components/sections/SectionDimensions';
import { SectionEnroulement } from '@/components/sections/SectionEnroulement';
import { SectionEntrefer } from '@/components/sections/SectionEntrefer';
import { SectionPoles } from '@/components/sections/SectionPoles';
import { SectionCaracteristique } from '@/components/sections/SectionCaracteristique';
import { SectionReactance } from '@/components/sections/SectionReactance';
import { SectionFMMCharge } from '@/components/sections/SectionFMMCharge';
import { SectionExcitation } from '@/components/sections/SectionExcitation';
import { SectionResume } from '@/components/sections/SectionResume';

function SectionContent() {
  const { activeSection } = useMachine();
  const map: Record<string, React.ReactNode> = {
    nominales: <SectionNominales />,
    dimensions: <SectionDimensions />,
    enroulement: <SectionEnroulement />,
    entrefer: <SectionEntrefer />,
    poles: <SectionPoles />,
    caracteristique: <SectionCaracteristique />,
    reactance: <SectionReactance />,
    fmmCharge: <SectionFMMCharge />,
    excitation: <SectionExcitation />,
    resume: <SectionResume />,
  };
  return <>{map[activeSection] || <SectionNominales />}</>;
}

function AppContent() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          <CahierDesChargesPanel />
          <SectionContent />
        </main>
      </div>
    </div>
  );
}

const Index = () => (
  <MachineProvider>
    <AppContent />
  </MachineProvider>
);

export default Index;
