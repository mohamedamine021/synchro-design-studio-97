// Calculation engine for synchronous machine design
// Based on standard PFE formulas for salient-pole alternators

import type {
  CahierDesCharges,
  ValeursNominales,
  DimensionsPrincipales,
  EnroulementStator,
  Entrefer,
  PolesRotor,
  CaracteristiqueVide,
  ReactanceDispersion,
  FMMExcitationCharge,
  EnroulementExcitation,
} from '@/types/machine';

// ======================== TABLES DE DONNÉES ========================

// Diamètres normalisés stator (m)
export const DIAMETRES_NORMALISES = [
  0.20, 0.22, 0.25, 0.28, 0.30, 0.32, 0.35, 0.38, 0.40, 0.42, 0.45,
  0.48, 0.50, 0.53, 0.56, 0.60, 0.63, 0.67, 0.71, 0.75, 0.80, 0.85,
  0.90, 0.95, 1.00, 1.06, 1.12, 1.18, 1.25, 1.32, 1.40, 1.50, 1.60,
  1.70, 1.80, 1.90, 2.00,
];

// Courbe B-H pour acier électrique (tôle M400-50A)
export const COURBE_BH: { B: number; H: number }[] = [
  { B: 0.0, H: 0 },
  { B: 0.1, H: 30 },
  { B: 0.2, H: 45 },
  { B: 0.3, H: 55 },
  { B: 0.4, H: 65 },
  { B: 0.5, H: 75 },
  { B: 0.6, H: 85 },
  { B: 0.7, H: 100 },
  { B: 0.8, H: 120 },
  { B: 0.9, H: 140 },
  { B: 1.0, H: 170 },
  { B: 1.1, H: 210 },
  { B: 1.2, H: 280 },
  { B: 1.3, H: 400 },
  { B: 1.4, H: 650 },
  { B: 1.5, H: 1100 },
  { B: 1.6, H: 1900 },
  { B: 1.7, H: 3500 },
  { B: 1.8, H: 7000 },
  { B: 1.9, H: 14000 },
  { B: 2.0, H: 30000 },
];

// Interpolation linéaire sur la courbe B-H
export function getH(B: number): number {
  if (B <= 0) return 0;
  if (B >= 2.0) return 30000;
  for (let i = 1; i < COURBE_BH.length; i++) {
    if (B <= COURBE_BH[i].B) {
      const ratio = (B - COURBE_BH[i - 1].B) / (COURBE_BH[i].B - COURBE_BH[i - 1].B);
      return COURBE_BH[i - 1].H + ratio * (COURBE_BH[i].H - COURBE_BH[i - 1].H);
    }
  }
  return 30000;
}

// ======================== SECTION 1: VALEURS NOMINALES ========================

export function calculerValeursNominales(cdc: CahierDesCharges): ValeursNominales {
  const p = (60 * cdc.f) / cdc.nn; // Nombre de paires de pôles
  const sinPhi = Math.sqrt(1 - cdc.cosPhi * cdc.cosPhi);
  const Sn = cdc.Pn / cdc.cosPhi; // kVA
  const Uph = cdc.Unl / Math.sqrt(3); // V
  const In = (Sn * 1000) / (Math.sqrt(3) * cdc.Unl); // A
  const Omega = (2 * Math.PI * cdc.nn) / 60; // rad/s
  const Tn = (cdc.Pn * 1000) / Omega; // N.m

  return { p, Sn, In, Uph, sinPhi, Omega, Tn };
}

// ======================== SECTION 2: DIMENSIONS PRINCIPALES ========================

export function calculerDimensionsPrincipales(
  cdc: CahierDesCharges,
  nom: ValeursNominales,
  overrides?: Partial<DimensionsPrincipales>
): DimensionsPrincipales {
  // Coefficients typiques pour machine à pôles saillants
  const kE = overrides?.kE ?? 0.97; // E/U ratio
  const alpha_i = overrides?.alpha_i ?? 0.67; // Coefficient de forme
  const kw1 = overrides?.kw1 ?? 0.925; // Facteur de bobinage (estimation)
  
  // Charge linéique A (A/m) et induction Bδn (T) - valeurs typiques
  const A = overrides?.A ?? getTypicalA(cdc.Pn, nom.p);
  const Bdelta_n = overrides?.Bdelta_n ?? getTypicalBdelta(cdc.Pn, nom.p);

  // Coefficient de la machine (formule d'Esson)
  const Ca = Math.PI * Math.PI * Math.sqrt(2) * kE * alpha_i * kw1 * A * Bdelta_n;
  // Ca en VA·s/m³

  // D²L = Sn * 1000 / (Ca * nn/60)
  const D2L = (nom.Sn * 1000) / (Ca * (cdc.nn / 60));

  // Rapport lambda = L / tau_p (typiquement 0.8-2.5 pour pôles saillants)
  const lambda = overrides?.lambda ?? getTypicalLambda(nom.p);

  // D³ = D²L * 2p / (π * λ)  =>  D = (D²L * 2p / (π * λ))^(1/3)
  const D_calc = Math.pow((D2L * 2 * nom.p) / (Math.PI * lambda), 1 / 3);

  // Normalisation du diamètre
  const D = overrides?.D ?? normaliserDiametre(D_calc);
  
  const tau_p = (Math.PI * D) / (2 * nom.p);
  const L_calc = lambda * tau_p;
  const L = overrides?.L ?? Math.round(L_calc * 1000) / 1000;
  
  // Diamètre extérieur (approximation: Da ≈ D + 2*hcs + 2*hc1)
  const Da = overrides?.Da ?? Math.round(D * 1.4 * 100) / 100;

  return { D, Da, L, lambda, tau_p, A, Bdelta_n, alpha_i, kw1, kE };
}

function getTypicalA(Pn: number, p: number): number {
  // Charge linéique typique en A/m
  if (Pn <= 100) return 25000;
  if (Pn <= 500) return 35000;
  if (Pn <= 1000) return 40000;
  return 45000;
}

function getTypicalBdelta(Pn: number, p: number): number {
  if (Pn <= 100) return 0.75;
  if (Pn <= 500) return 0.85;
  return 0.9;
}

function getTypicalLambda(p: number): number {
  if (p <= 2) return 1.5;
  if (p <= 4) return 1.2;
  return 1.0;
}

function normaliserDiametre(D: number): number {
  let closest = DIAMETRES_NORMALISES[0];
  let minDiff = Math.abs(D - closest);
  for (const d of DIAMETRES_NORMALISES) {
    const diff = Math.abs(D - d);
    if (diff < minDiff) {
      minDiff = diff;
      closest = d;
    }
  }
  return closest;
}

// ======================== SECTION 3: ENROULEMENT STATOR ========================

export function calculerEnroulementStator(
  cdc: CahierDesCharges,
  nom: ValeursNominales,
  dim: DimensionsPrincipales,
  overrides?: Partial<EnroulementStator>
): EnroulementStator {
  const m = 3; // Nombre de phases

  // Nombre d'encoches par pôle et par phase
  const q1 = overrides?.q1 ?? Math.round(getTypicalQ1(nom.p));
  
  // Nombre total d'encoches
  const Z1 = 2 * nom.p * m * q1;

  // Pas dentaire
  const tau_z1 = (Math.PI * dim.D) / Z1;

  // Pas de bobinage (raccourci à 5/6 pour réduire les harmoniques)
  const y_full = Z1 / (2 * nom.p); // pas diamétral
  const y = overrides?.y ?? Math.round(y_full * 5 / 6);

  // EMF par phase
  const E = dim.kE * nom.Uph;

  // Nombre de spires par phase
  // E = 4.44 * f * kw1 * w1 * Phi
  // Phi = alpha_i * tau_p * L * Bdelta_n
  const Phi = dim.alpha_i * dim.tau_p * dim.L * dim.Bdelta_n;
  const w1_calc = E / (4.44 * cdc.f * dim.kw1 * Phi);
  const w1 = overrides?.w1 ?? Math.round(w1_calc);

  // Nombre de conducteurs par encoche
  const ac = overrides?.ac ?? 1; // voies parallèles
  const Nc_calc = (2 * m * w1 * ac) / Z1;
  const Nc = overrides?.Nc ?? Math.round(Nc_calc);

  // Recalcul de w1 après arrondi de Nc
  const w1_real = (Nc * Z1) / (2 * m * ac);

  // Courant de phase
  const Iph = nom.In / ac;

  // Section du conducteur
  const J = 4.5; // Densité de courant A/mm²
  const Sc_calc = Iph / J;
  const Sc = overrides?.Sc ?? Math.round(Sc_calc * 10) / 10;

  // Largeur de dent stator
  const bz1_calc = (dim.Bdelta_n * tau_z1) / 1.7; // Bz1 ≈ 1.7 T
  const bz1 = overrides?.bz1 ?? Math.round(bz1_calc * 10000) / 10000;

  // Largeur d'encoche
  const bc1 = tau_z1 - bz1;

  // Hauteur d'encoche (estimation)
  const hc1_calc = (Nc * Sc * 1e-6) / (bc1 * 0.4); // kf ≈ 0.4 coefficient de remplissage
  const hc1 = overrides?.hc1 ?? Math.round(hc1_calc * 1000) / 1000;

  // Hauteur culasse stator
  const Bcs_target = 1.4; // T
  const hcs_calc = Phi / (2 * dim.L * Bcs_target);
  const hcs = overrides?.hcs ?? Math.round(hcs_calc * 1000) / 1000;

  // Inductions
  const Bz1 = (dim.Bdelta_n * tau_z1) / bz1;
  const Bcs = Phi / (2 * dim.L * hcs);

  return {
    q1, Z1, y, tau_z1, Nc, w1: Math.round(w1_real),
    Iph, Sc, ac, bz1, hc1, bc1, hcs, Bz1, Bcs,
  };
}

function getTypicalQ1(p: number): number {
  if (p <= 2) return 6;
  if (p <= 4) return 4;
  return 3;
}

// ======================== SECTION 4: ENTREFER ========================

export function calculerEntrefer(
  cdc: CahierDesCharges,
  nom: ValeursNominales,
  dim: DimensionsPrincipales,
  overrides?: Partial<Entrefer>
): Entrefer {
  // Entrefer: δ = (0.01 - 0.015) * τp pour machines à pôles saillants
  const delta_calc = 0.012 * dim.tau_p;
  const delta = overrides?.delta ?? Math.round(delta_calc * 10000) / 10000;

  // Coefficient de Carter
  const tau_z1 = (Math.PI * dim.D) / (6 * nom.p * 3); // approximation
  const b_enc = tau_z1 * 0.5; // largeur ouverture encoche
  const gamma = (b_enc / delta) * (b_enc / delta) / (5 + b_enc / delta);
  const kdelta = overrides?.kdelta ?? Math.round((tau_z1 / (tau_z1 - gamma * delta)) * 1000) / 1000;

  return { delta, kdelta };
}

// ======================== SECTION 5: PÔLES ROTOR ========================

export function calculerPolesRotor(
  cdc: CahierDesCharges,
  nom: ValeursNominales,
  dim: DimensionsPrincipales,
  overrides?: Partial<PolesRotor>
): PolesRotor {
  const alpha_p = overrides?.alpha_p ?? 0.67; // Coefficient d'arc polaire
  const bp = alpha_p * dim.tau_p;
  
  // Hauteur du pôle
  const hp_calc = 0.15 * dim.D / (2 * nom.p);
  const hp = overrides?.hp ?? Math.round(Math.max(hp_calc, 0.04) * 1000) / 1000;

  // Hauteur culasse rotor
  const Phi = dim.alpha_i * dim.tau_p * dim.L * dim.Bdelta_n;
  const Bcr_target = 1.2;
  const hcr_calc = Phi / (2 * dim.L * Bcr_target);
  const hcr = overrides?.hcr ?? Math.round(hcr_calc * 1000) / 1000;

  const Bcr = Phi / (2 * dim.L * hcr);
  const Bp = Phi / (bp * dim.L * 0.95); // 0.95 = coefficient d'empilement

  return { bp, hp, alpha_p, hcr, Bcr, Bp };
}

// ======================== SECTION 6: CARACTÉRISTIQUE À VIDE ========================

export function calculerCaracteristiqueVide(
  cdc: CahierDesCharges,
  nom: ValeursNominales,
  dim: DimensionsPrincipales,
  enr: EnroulementStator,
  ent: Entrefer,
  poles: PolesRotor
): CaracteristiqueVide {
  const mu0 = 4 * Math.PI * 1e-7;
  
  // FMM entrefer
  const delta_eff = ent.delta * ent.kdelta;
  const F_delta = (dim.Bdelta_n * delta_eff) / mu0;

  // FMM dent stator
  const Hz1 = getH(enr.Bz1);
  const F_z1 = 2 * Hz1 * enr.hc1;

  // FMM culasse stator
  const Hcs = getH(enr.Bcs);
  const Lcs = (Math.PI * (dim.Da - enr.hcs)) / (2 * nom.p * 2);
  const F_cs = Hcs * Lcs;

  // FMM pôle
  const Hp = getH(poles.Bp);
  const F_p = Hp * poles.hp;

  // FMM culasse rotor
  const Hcr = getH(poles.Bcr);
  const Lcr = (Math.PI * (dim.D - 2 * ent.delta - 2 * poles.hp - poles.hcr)) / (2 * nom.p * 2);
  const F_cr = Math.max(0, Hcr * Math.abs(Lcr));

  // FMM totale
  const F0 = F_delta + F_z1 + F_cs + F_p + F_cr;

  // Points de la caractéristique à vide
  const Bdelta_values = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.1, 1.2, 1.3];
  const points = Bdelta_values.map(Bd => {
    const ratio = Bd / dim.Bdelta_n;
    const Fd = (Bd * delta_eff) / mu0;
    
    // Proportionnel pour les parties linéaires, plus que proportionnel pour le fer
    const Bz = enr.Bz1 * ratio;
    const Bcs_v = enr.Bcs * ratio;
    const Bp_v = poles.Bp * ratio;
    const Bcr_v = poles.Bcr * ratio;
    
    const Fz = 2 * getH(Bz) * enr.hc1;
    const Fcs_v = getH(Bcs_v) * Lcs;
    const Fp_v = getH(Bp_v) * poles.hp;
    const Fcr_v = getH(Bcr_v) * Math.abs(Lcr);
    
    const Ftotal = Fd + Fz + Fcs_v + Fp_v + Fcr_v;
    
    return {
      excitation: Ftotal,
      tension: ratio * 100, // % de Un
    };
  });

  return { points, Bdelta_values, F_delta, F_z1, F_cs, F_p, F_cr, F0 };
}

// ======================== SECTION 7: RÉACTANCE DE DISPERSION ========================

export function calculerReactanceDispersion(
  cdc: CahierDesCharges,
  nom: ValeursNominales,
  dim: DimensionsPrincipales,
  enr: EnroulementStator,
  ent: Entrefer
): ReactanceDispersion {
  const mu0 = 4 * Math.PI * 1e-7;
  const m = 3;

  // Réactance de réaction d'induit axe d
  const Zbase = nom.Uph / nom.In;
  
  // Facteur de forme
  const kd = 1.0; // approximation
  const kad = dim.alpha_i; // approximation

  // x_ad (pu) = réactance de magnétisation axe d
  const x_ad_calc = (2 * mu0 * cdc.f * dim.L * dim.tau_p * (enr.w1 * dim.kw1) ** 2 * kad) /
    (Math.PI * nom.p * ent.delta * ent.kdelta * Zbase);
  const x_ad = Math.round(x_ad_calc * 1000) / 1000;

  // x_aq ≈ 0.6 * x_ad pour pôles saillants
  const xq_factor = 0.6;

  // Réactance de dispersion d'encoche
  const lambda_enc = (enr.hc1 / (3 * enr.bc1)) + 0.5;
  
  // Réactance de dispersion de tête de bobine  
  const lambda_tb = 0.3;

  // Réactance de dispersion totale
  const x_sigma_calc = (4 * Math.PI * mu0 * cdc.f * enr.w1 ** 2 * dim.L * (lambda_enc + lambda_tb)) /
    (nom.p * enr.q1 * Zbase);
  const x_sigma = Math.round(x_sigma_calc * 1000) / 1000;

  const xd = x_ad + x_sigma;
  const xq = x_ad * xq_factor + x_sigma;

  return { xd: Math.round(xd * 1000) / 1000, xq: Math.round(xq * 1000) / 1000, x_sigma, x_ad };
}

// ======================== SECTION 8: FMM D'EXCITATION EN CHARGE ========================

export function calculerFMMCharge(
  cdc: CahierDesCharges,
  nom: ValeursNominales,
  dim: DimensionsPrincipales,
  enr: EnroulementStator,
  carac: CaracteristiqueVide,
  react: ReactanceDispersion
): FMMExcitationCharge {
  const m = 3;
  
  // FMM de réaction d'induit
  // Fad = (m * sqrt(2) * w1 * kw1 * In * kd) / (π * p)
  const Fad_calc = (m * Math.sqrt(2) * enr.w1 * dim.kw1 * nom.In * dim.alpha_i) / (Math.PI * nom.p);
  const Fad = Math.round(Fad_calc);

  const Faq_calc = Fad * 0.6; // Pour pôles saillants
  const Faq = Math.round(Faq_calc);

  // FMM d'excitation en charge (méthode de Potier simplifiée)
  // Fex = sqrt((F0 + Fad*sinφ)² + (Faq*cosφ)²)
  const Fex_calc = Math.sqrt(
    (carac.F0 + Fad * nom.sinPhi) ** 2 + 
    (Faq * cdc.cosPhi) ** 2
  );
  const Fex = Math.round(Fex_calc);

  return { Fad, Faq, Fex };
}

// ======================== SECTION 9: ENROULEMENT D'EXCITATION ========================

export function calculerEnroulementExcitation(
  cdc: CahierDesCharges,
  nom: ValeursNominales,
  dim: DimensionsPrincipales,
  poles: PolesRotor,
  fmmCharge: FMMExcitationCharge,
  overrides?: Partial<EnroulementExcitation>
): EnroulementExcitation {
  // Nombre de spires d'excitation par pôle
  // F = w_ex * I_ex => besoin F/pôle
  const F_per_pole = fmmCharge.Fex;

  // Densité de courant excitation (A/mm²)
  const Jex = 3.0;
  
  // Hauteur disponible pour l'enroulement
  const h_disp = poles.hp * 0.85; // 85% de la hauteur du pôle
  const b_disp = (dim.tau_p - poles.bp) * 0.7; // espace inter-polaire

  // Surface disponible pour l'enroulement
  const S_wind = h_disp * b_disp;

  // Coefficient de remplissage
  const kf = 0.65;

  // I_ex * w_ex = F_per_pole
  // S_ex * w_ex = S_wind * kf
  // S_ex = I_ex / Jex
  // => I_ex² * w_ex / Jex = S_wind * kf * I_ex
  // => w_ex = Jex * S_wind * kf * 1e6 / F_per_pole  (approximation)

  // On choisit un courant d'excitation raisonnable
  const Iex_calc = Math.sqrt(F_per_pole * Jex * S_wind * kf * 1e6) / F_per_pole * Math.sqrt(F_per_pole);
  const Iex = overrides?.Iex ?? Math.round(Math.max(Iex_calc, 5) * 10) / 10;

  const wex_calc = F_per_pole / Iex;
  const wex = overrides?.wex ?? Math.round(wex_calc);

  const Sex_calc = Iex / Jex;
  const Sex = overrides?.Sex ?? Math.round(Sex_calc * 10) / 10;

  // Puissance d'excitation
  const rho = 1.75e-8; // résistivité cuivre (Ω.m)
  const l_spire = 2 * (dim.L + b_disp) + 0.1; // longueur moyenne d'une spire
  const R_ex = (rho * wex * l_spire * 2 * nom.p) / (Sex * 1e-6);
  const Pex = R_ex * Iex * Iex;

  return {
    wex,
    Iex,
    Sex,
    Pex: overrides?.Pex ?? Math.round(Pex),
  };
}

// ======================== CALCUL COMPLET ========================

export function calculerTout(
  cdc: CahierDesCharges,
  overrides?: {
    dimensions?: Partial<DimensionsPrincipales>;
    enroulement?: Partial<EnroulementStator>;
    entrefer?: Partial<Entrefer>;
    poles?: Partial<PolesRotor>;
    excitation?: Partial<EnroulementExcitation>;
  }
) {
  const nominales = calculerValeursNominales(cdc);
  const dimensions = calculerDimensionsPrincipales(cdc, nominales, overrides?.dimensions);
  const enroulement = calculerEnroulementStator(cdc, nominales, dimensions, overrides?.enroulement);
  const entrefer = calculerEntrefer(cdc, nominales, dimensions, overrides?.entrefer);
  const poles = calculerPolesRotor(cdc, nominales, dimensions, overrides?.poles);
  const caracteristique = calculerCaracteristiqueVide(cdc, nominales, dimensions, enroulement, entrefer, poles);
  const reactance = calculerReactanceDispersion(cdc, nominales, dimensions, enroulement, entrefer);
  const fmmCharge = calculerFMMCharge(cdc, nominales, dimensions, enroulement, caracteristique, reactance);
  const excitation = calculerEnroulementExcitation(cdc, nominales, dimensions, poles, fmmCharge, overrides?.excitation);

  return { nominales, dimensions, enroulement, entrefer, poles, caracteristique, reactance, fmmCharge, excitation };
}
