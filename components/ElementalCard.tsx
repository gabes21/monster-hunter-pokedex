import { ElementalWeakness } from "@/types";
import Image from "next/image";

const ElementalCard = ({ elements }: { elements: ElementalWeakness }) => {
  console.log("elemental card elements: ", elements);
  const sortedElements = Object.entries(elements)
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
            src={`/images/${element}.png`}
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

export default ElementalCard;
