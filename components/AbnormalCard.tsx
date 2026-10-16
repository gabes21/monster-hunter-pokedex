import { AbnormalStatusList, ElementalWeakness } from "@/types";
import Image from "next/image";

const AbnormalCard = ({
  abnormalStatus,
}: {
  abnormalStatus: AbnormalStatusList;
}) => {
  const cleanAbnormalStatus = abnormalStatus || [];
  return (
    <div className="flex justify-center items-center">
      {cleanAbnormalStatus.map((status, index) => (
        <div key={index} className="flex flex-col items-center">
          <Image
            src={`/images/${status}.png`}
            alt={status}
            title={status}
            width={18}
            height={18}
          />
        </div>
      ))}
    </div>
  );
};

export default AbnormalCard;
