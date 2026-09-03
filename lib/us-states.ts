/** 50 U.S. states plus Washington, D.C. — the only values allowed in location copy. */

export type USState = {
  name: string;
  abbreviation: string;
  /** Natural language for headlines (“Washington, D.C.” vs “District of Columbia”). */
  displayName: string;
};

export const US_STATES: readonly USState[] = [
  { name: 'Alabama', abbreviation: 'AL', displayName: 'Alabama' },
  { name: 'Alaska', abbreviation: 'AK', displayName: 'Alaska' },
  { name: 'Arizona', abbreviation: 'AZ', displayName: 'Arizona' },
  { name: 'Arkansas', abbreviation: 'AR', displayName: 'Arkansas' },
  { name: 'California', abbreviation: 'CA', displayName: 'California' },
  { name: 'Colorado', abbreviation: 'CO', displayName: 'Colorado' },
  { name: 'Connecticut', abbreviation: 'CT', displayName: 'Connecticut' },
  { name: 'Delaware', abbreviation: 'DE', displayName: 'Delaware' },
  { name: 'Florida', abbreviation: 'FL', displayName: 'Florida' },
  { name: 'Georgia', abbreviation: 'GA', displayName: 'Georgia' },
  { name: 'Hawaii', abbreviation: 'HI', displayName: 'Hawaii' },
  { name: 'Idaho', abbreviation: 'ID', displayName: 'Idaho' },
  { name: 'Illinois', abbreviation: 'IL', displayName: 'Illinois' },
  { name: 'Indiana', abbreviation: 'IN', displayName: 'Indiana' },
  { name: 'Iowa', abbreviation: 'IA', displayName: 'Iowa' },
  { name: 'Kansas', abbreviation: 'KS', displayName: 'Kansas' },
  { name: 'Kentucky', abbreviation: 'KY', displayName: 'Kentucky' },
  { name: 'Louisiana', abbreviation: 'LA', displayName: 'Louisiana' },
  { name: 'Maine', abbreviation: 'ME', displayName: 'Maine' },
  { name: 'Maryland', abbreviation: 'MD', displayName: 'Maryland' },
  { name: 'Massachusetts', abbreviation: 'MA', displayName: 'Massachusetts' },
  { name: 'Michigan', abbreviation: 'MI', displayName: 'Michigan' },
  { name: 'Minnesota', abbreviation: 'MN', displayName: 'Minnesota' },
  { name: 'Mississippi', abbreviation: 'MS', displayName: 'Mississippi' },
  { name: 'Missouri', abbreviation: 'MO', displayName: 'Missouri' },
  { name: 'Montana', abbreviation: 'MT', displayName: 'Montana' },
  { name: 'Nebraska', abbreviation: 'NE', displayName: 'Nebraska' },
  { name: 'Nevada', abbreviation: 'NV', displayName: 'Nevada' },
  { name: 'New Hampshire', abbreviation: 'NH', displayName: 'New Hampshire' },
  { name: 'New Jersey', abbreviation: 'NJ', displayName: 'New Jersey' },
  { name: 'New Mexico', abbreviation: 'NM', displayName: 'New Mexico' },
  { name: 'New York', abbreviation: 'NY', displayName: 'New York' },
  { name: 'North Carolina', abbreviation: 'NC', displayName: 'North Carolina' },
  { name: 'North Dakota', abbreviation: 'ND', displayName: 'North Dakota' },
  { name: 'Ohio', abbreviation: 'OH', displayName: 'Ohio' },
  { name: 'Oklahoma', abbreviation: 'OK', displayName: 'Oklahoma' },
  { name: 'Oregon', abbreviation: 'OR', displayName: 'Oregon' },
  { name: 'Pennsylvania', abbreviation: 'PA', displayName: 'Pennsylvania' },
  { name: 'Rhode Island', abbreviation: 'RI', displayName: 'Rhode Island' },
  { name: 'South Carolina', abbreviation: 'SC', displayName: 'South Carolina' },
  { name: 'South Dakota', abbreviation: 'SD', displayName: 'South Dakota' },
  { name: 'Tennessee', abbreviation: 'TN', displayName: 'Tennessee' },
  { name: 'Texas', abbreviation: 'TX', displayName: 'Texas' },
  { name: 'Utah', abbreviation: 'UT', displayName: 'Utah' },
  { name: 'Vermont', abbreviation: 'VT', displayName: 'Vermont' },
  { name: 'Virginia', abbreviation: 'VA', displayName: 'Virginia' },
  { name: 'Washington', abbreviation: 'WA', displayName: 'Washington' },
  { name: 'West Virginia', abbreviation: 'WV', displayName: 'West Virginia' },
  { name: 'Wisconsin', abbreviation: 'WI', displayName: 'Wisconsin' },
  { name: 'Wyoming', abbreviation: 'WY', displayName: 'Wyoming' },
  { name: 'District of Columbia', abbreviation: 'DC', displayName: 'Washington, D.C.' },
] as const;

const BY_ABBR = new Map(US_STATES.map((s) => [s.abbreviation, s]));
const BY_NORMALIZED_NAME = new Map(US_STATES.map((s) => [normalizeStateKey(s.name), s]));

const DISPLAY_ALIASES: Record<string, string> = {
  dc: 'DC',
  'd c': 'DC',
  'washington dc': 'DC',
  'washington d c': 'DC',
  'district of columbia': 'DC',
  'washington d.c': 'DC',
};

export function normalizeStateKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function findUSState(raw: string | null | undefined): USState | null {
  if (!raw) return null;
  const key = normalizeStateKey(raw);
  if (!key) return null;

  const alias = DISPLAY_ALIASES[key];
  if (alias) return BY_ABBR.get(alias) ?? null;

  if (key.length === 2) return BY_ABBR.get(key.toUpperCase()) ?? null;

  return BY_NORMALIZED_NAME.get(key) ?? null;
}

export function stateFromAbbreviation(abbr: string | null | undefined): USState | null {
  if (!abbr) return null;
  return BY_ABBR.get(abbr.trim().toUpperCase()) ?? null;
}
