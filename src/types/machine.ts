// Types for the synchronous machine designer

export interface CahierDesCharges {
  Pn: number;        // Puissance nominale (kW)
  Unl: number;       // Tension nominale ligne (V)
  cosPhi: number;    // Facteur de puissance
  f: number;         // Fréquence (Hz)
  nn: number;        // Vitesse nominale (tr/min)
  typeArbre: 'horizontal' | 'vertical';
  ventilation: 'radiale' | 'axiale';
  typeExcitation: 'bagues' | 'brushless';
}

export interface ValeursNominales {
  p: number;          // Nombre de paires de pôles
  Sn: number;         // Puissance apparente (kVA)
  In: number;         // Courant nominal (A)
  Uph: number;        // Tension phase (V)
  sinPhi: number;
  Omega: number;      // Vitesse angulaire (rad/s)
  Tn: number;         // Couple nominal (N.m)
}

export interface DimensionsPrincipales {
  D: number;          // Diamètre d'alésage (m)
  Da: number;         // Diamètre extérieur stator (m)
  L: number;          // Longueur active (m)
  lambda: number;     // Rapport L/tau_p
  tau_p: number;      // Pas polaire (m)
  A: number;          // Charge linéique (A/m)
  Bdelta_n: number;   // Induction dans l'entrefer (T)
  alpha_i: number;    // Coefficient de forme de l'arc polaire
  kw1: number;        // Facteur de bobinage
  kE: number;         // Rapport EMF/tension
}

export interface EnroulementStator {
  q1: number;         // Nombre d'encoches par pôle et par phase
  Z1: number;         // Nombre total d'encoches stator
  y: number;          // Pas de bobinage (en encoches)
  tau_z1: number;     // Pas dentaire (m)
  Nc: number;         // Nombre de conducteurs par encoche
  w1: number;         // Nombre de spires par phase
  Iph: number;        // Courant de phase (A)
  Sc: number;         // Section du conducteur (mm²)
  ac: number;         // Nombre de voies parallèles
  bz1: number;        // Largeur de dent stator (m)
  hc1: number;        // Hauteur d'encoche (m)
  bc1: number;        // Largeur d'encoche (m)
  hcs: number;        // Hauteur de culasse stator (m)
  Bz1: number;        // Induction dans la dent (T)
  Bcs: number;        // Induction dans la culasse stator (T)
}

export interface Entrefer {
  delta: number;      // Entrefer (m)
  kdelta: number;     // Coefficient de Carter
}

export interface PolesRotor {
  bp: number;         // Largeur du pôle (m)
  hp: number;         // Hauteur du pôle (m)
  alpha_p: number;    // Coefficient d'arc polaire
  hcr: number;        // Hauteur de culasse rotor (m)
  Bcr: number;        // Induction culasse rotor (T)
  Bp: number;         // Induction dans le pôle (T)
}

export interface CaracteristiqueVide {
  points: { excitation: number; tension: number }[];
  Bdelta_values: number[];
  F_delta: number;    // FMM entrefer
  F_z1: number;       // FMM dent stator
  F_cs: number;       // FMM culasse stator
  F_p: number;        // FMM pôle
  F_cr: number;       // FMM culasse rotor
  F0: number;         // FMM totale à vide
}

export interface ReactanceDispersion {
  xd: number;         // Réactance synchrone directe (pu)
  xq: number;         // Réactance synchrone en quadrature (pu)
  x_sigma: number;    // Réactance de dispersion (pu)
  x_ad: number;       // Réactance de réaction d'induit (axe d)
}

export interface FMMExcitationCharge {
  Fad: number;        // FMM de réaction d'induit (axe d)
  Faq: number;        // FMM de réaction d'induit (axe q)
  Fex: number;        // FMM d'excitation en charge
}

export interface EnroulementExcitation {
  wex: number;        // Nombre de spires excitation
  Iex: number;        // Courant d'excitation (A)
  Sex: number;        // Section conducteur excitation (mm²)
  Pex: number;        // Puissance d'excitation (W)
}

export interface CalculationResults {
  nominales: ValeursNominales | null;
  dimensions: DimensionsPrincipales | null;
  enroulement: EnroulementStator | null;
  entrefer: Entrefer | null;
  poles: PolesRotor | null;
  caracteristique: CaracteristiqueVide | null;
  reactance: ReactanceDispersion | null;
  fmmCharge: FMMExcitationCharge | null;
  excitation: EnroulementExcitation | null;
}

export type SectionId = 
  | 'nominales'
  | 'dimensions'
  | 'enroulement'
  | 'entrefer'
  | 'poles'
  | 'caracteristique'
  | 'reactance'
  | 'fmmCharge'
  | 'excitation'
  | 'resume';

export interface SectionConfig {
  id: SectionId;
  label: string;
  shortLabel: string;
  icon: string;
  numero: number;
}
