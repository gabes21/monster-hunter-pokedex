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
      className={`border-2 border-solid w-full min-h-[50px] flex justify-start items-center gap-1 px-4 rounded-[5px] ${selected ? "bg-blue-900" : "bg-panel-background hover:bg-blue-700 active:bg-blue-900"}`}
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
