const MonsterCard = ({
  index,
  name,
  selected = false,
  onClick,
}: {
  index: number;
  name: string;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={`w-full min-h-[50px] flex justify-start items-center gap-1 px-4 rounded-[8px] ${selected ? "border-4 border-solid border-red-800 bg-panel-background text-white" : " hover:bg-blue-700 active:bg-blue-900 "}`}
      onClick={() => {
        console.log("selected: ", selected);
        if (selected) return;
        onClick();
      }}
    >
      <h1>{index}.</h1>
      <h1>{name ? name : "....."}</h1>
    </button>
  );
};

export default MonsterCard;
