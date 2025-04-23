export interface ElementData {
  number: number;
  symbol: string;
  name_fr: string;
  name_en: string;
  category: string;
  atomic_mass: number;
  description_fr: string;
  description_en: string;
  discovery_year?: number;
  discoverer?: string;
  electron_configuration?: string;
  electronegativity?: number;
  state_at_stp?: string;
  melting_point?: number;
  boiling_point?: number;
  density?: number;
  uses_fr: string[];
  uses_en: string[];
  fun_fact_fr?: string;
  fun_fact_en?: string;
  technical_details_fr?: string;
  technical_details_en?: string;
  image?: string;
  group?: number;
  period?: number;
  block?: string;
}

export interface ElementBasic {
  number: number;
  symbol: string;
  name_fr: string;
  name_en: string;
  category: string;
  state_at_stp?: string;
}

export type ElementCategory =
  | 'alkali metal'
  | 'alkaline earth metal'
  | 'transition metal'
  | 'metal'
  | 'metalloid'
  | 'nonmetal'
  | 'diatomic nonmetal'
  | 'halogen'
  | 'noble gas'
  | 'lanthanide'
  | 'actinide'
  | 'post-transition metal';

export type ElementState = 'solid' | 'liquid' | 'gas';

export type ElementFilter = {
  id: string;
  label_fr: string;
  label_en: string;
  filter: (element: ElementData) => boolean;
}; 