import { loadElementImagePath } from "@/lib/util";
import { Element, ElementalWeakness, BodyPartWeakness } from "@/types";
import Image from "next/image";

const ElementalWeaknessCard = ({
  elements,
}: {
  elements: ElementalWeakness;
}) => {
  const sortedElements = (
    Object.entries(elements) as [Element, BodyPartWeakness][]
  )
    .filter(([_, bodyParts]) => Object.keys(bodyParts).length > 0)
    .map(([element, bodyParts]) => ({
      element,
      totalDamage: Object.values(bodyParts).reduce(
        (total, damage) => total + damage,
        0,
      ),
    }))
    .sort((a, b) => b.totalDamage - a.totalDamage);

  return (
    <div className="flex justify-center items-center">
      {sortedElements.map(({ element, totalDamage }) => (
        <div key={element} className="flex flex-col items-center">
          <Image
            src={loadElementImagePath(element)}
            alt={element}
            title={element}
            width={18}
            height={18}
          />
        </div>
      ))}
    </div>
  );
};

export default ElementalWeaknessCard;
