import { loadElementImagePath } from "@/lib/util";
import { Element } from "@/types";
import Image from "next/image";

const ElementCard = ({ elements }: { elements: Element[] }) => {
  const sortedElements = elements || [];
  return (
    <div className="flex justify-center items-center">
      {sortedElements.map((element, index) => (
        <div key={index} className="flex flex-col items-center">
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

export default ElementCard;
