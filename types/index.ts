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

export type Element = "fire" | "water" | "thunder" | "ice" | "dragon";

export type AbnormalStatus = "frenzy";

export type AbnormalStatusList = AbnormalStatus[];

export type ElementalWeakness = Partial<Record<Element, BodyPartWeakness>>;

export type Monster = {
  id: string;
  name: string;
  img: string;
  threatLevel: number;
  elementalWeakness: ElementalWeakness;
  abnormalStatus: AbnormalStatusList;
};
