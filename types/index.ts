export type BodyPart =
  | "head"
  | "neck"
  | "torso"
  | "wingarm"
  | "foreleg"
  | "hindleg"
  | "wing"
  | "tail"
  | "antenna";

export type BodyPartWeakness = Partial<Record<BodyPart, number>>;

//This include ailments as well
export type Element =
  | "fire"
  | "water"
  | "thunder"
  | "ice"
  | "dragon"
  | "fireblight"
  | "waterblight"
  | "thunderblight"
  | "iceblight"
  | "dragonblight"
  | "paralysis"
  | "poison"
  | "sleep"
  | "blast"
  | "blastblight";

export type AbnormalStatus = "frenzy";

export type AbnormalStatusList = AbnormalStatus[];

export type ElementalWeakness = Partial<Record<Element, BodyPartWeakness>>;

export type ElementalWeaknessEntry = {
  id: string;
  element: Element;
  bodyParts: BodyPartWeakness;
};

export type Monster = {
  id: string;
  name: string;
  imgKey: string;
  threatLevel: number;
  elementalWeakness: ElementalWeakness;
  abnormalStatus: AbnormalStatusList;
  imageUrl: string;
  blightElementalDamage: Element[];
  deletedAt?: string;
};

export type MonsterInput = {
  name: string;
  threatLevel: number;
  elementalWeakness: ElementalWeakness;
  abnormalStatus: AbnormalStatusList;
};

export const AbnormalStatusOptions: AbnormalStatusList = ["frenzy"];
export const elementList: Element[] = [
  "fire",
  "water",
  "thunder",
  "ice",
  "dragon",
];

export const isAbnormalStatus = (value: string): value is AbnormalStatus =>
  (AbnormalStatusOptions as readonly string[]).includes(value);
