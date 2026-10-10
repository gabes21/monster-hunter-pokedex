import React, { ReactNode } from "react";

const AttributeCard = ({
  label,
  value,
  labelClass,
  valueDivClass,
}: {
  label: string;
  value?: ReactNode;
  labelClass?: string;
  valueDivClass?: string;
}) => {
  return (
    <div className="flex justify-center items-center gap-3">
      <p className={`${labelClass}`}>{label} :</p>
      <div className={`${valueDivClass}`}>{value}</div>
    </div>
  );
};

export default AttributeCard;
