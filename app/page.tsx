"use client";
import AbnormalCard from "@/components/AbnormalCard";
import AttributeCard from "@/components/AttributeCard";
import MonsterCard from "@/components/MonsterCard";
import { Monster } from "@/types";
import { Images, Menu, Search, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAllMonster } from "./services/monsterServices";
import ElementalWeaknessCard from "@/components/ElementalWeaknessCard";
import ElementCard from "@/components/ElementCard";
import LoadingComponent from "@/components/LoadingComponent";

export default function Home() {
  const emptyMonsterData = (id: string): Monster => ({
    id: id,
    name: "............................",
    imgKey: "",
    threatLevel: 0,
    elementalWeakness: {},
    abnormalStatus: [],
    imageUrl: "",
    blightElementalDamage: [],
  });
  const [currentMonster, setCurrentMonster] = useState<Monster>(
    emptyMonsterData(""),
  );

  const [monsterList, setMonsterList] = useState<Monster[]>([
    emptyMonsterData(""),
  ]);

  const [filteredMonsterList, setFilteredMonsterList] = useState<Monster[]>([
    emptyMonsterData(""),
  ]);

  const [isAnimating, setIsAnimating] = useState(false);

  const maxThreatLevel = 10;

  const handleSelectMonster = (selectedMonster: Monster) => {
    setIsAnimating(false);
    console.log("selectedMonster: ", selectedMonster);
    setCurrentMonster(selectedMonster);
    requestAnimationFrame(() => {
      setIsAnimating(true);
    });
  };

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchMonsters() {
      try {
        setIsLoading(true);
        const data: Monster[] = await getAllMonster();
        const paddedMonsters = [
          ...data,
          ...Array.from({ length: Math.max(0, 15 - data.length) }, (_, index) =>
            emptyMonsterData(`empty-${index}`),
          ),
        ];
        setMonsterList(paddedMonsters);
        setFilteredMonsterList(paddedMonsters);
        if (data.length > 0) {
          console.log("imgKey", data[0].imgKey);
          setCurrentMonster(data[0]);
          setIsAnimating(true);
        }
      } catch (error) {
        alert("Failed to fetch monsters");
        console.error("Failed to fetch monsters:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMonsters();
  }, []);

  const filterFunctionMonster = (val: string, monster: Monster) => {
    return monster.name.toLowerCase().includes(val.toLowerCase());
  };

  const handleSearchMonster = (val: string) => {
    if (!val) {
      setFilteredMonsterList(monsterList);
      return;
    }
    const newList = monsterList.filter((item) =>
      filterFunctionMonster(val, item),
    );

    setFilteredMonsterList(newList);
  };

  if (isLoading) {
    return <LoadingComponent text={"Loading fetching monster"} />;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center h-screen relative">
      {/* <DraggableComponent></DraggableComponent> */}

      <main className="flex max-h-[90vh] min-h-0 flex-1 w-full flex-col justify-center items-center md:items-stretch md:flex-row md:gap-2 md:px-2">
        <section className="box-border w-full min-h-[30vh] shrink-0 border-2 border-black px-10 py-4 flex flex-col justify-center items-center gap-2 md:gap-5 md:w-1/2 md:flex-1 md:min-h-0">
          <div className="bg-panel-background border-1 border-black rounded-[5px] px-5 w-3/5 flex justify-center items-center">
            <div className="bg-white h-full w-[94%] rounded-[5px] text-center min-h-[25px] md:text-[21px]">
              <h1>{currentMonster.name || "???"}</h1>
            </div>
          </div>
          {currentMonster.imageUrl ? (
            <Image
              src={`${currentMonster.imageUrl}`}
              alt={currentMonster?.name || ""}
              width={300}
              height={200}
              className={`w-full h-auto max-w-[250px] md:max-w-[400px] lg:max-w-[500px] animate-[wiggle_1s_ease-in-out_infinite ${
                isAnimating ? "animate-[wiggle_0.6s_ease-in-out_1]" : ""
              }`}
              onAnimationEnd={() => setIsAnimating(false)}
            />
          ) : (
            <div className="w-[300px] h-[200px] flex flex-col justify-center items-center bg-gray-500">
              <Images />
            </div>
          )}
          <div className="bg-panel-background border-1 border-solid w-full h-auto min-h-[100px] rounded-[5px] flex flex-col justify-center items-center gap-1 md:p-3">
            <AttributeCard
              label={"Threat Level"}
              labelClass="text-xs md:text-[16px]"
              aria-label={`Threat level ${currentMonster.threatLevel} out of ${maxThreatLevel}`}
              value={
                <div className="flex justify-center items-center">
                  {Array.from({ length: maxThreatLevel }, (_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={
                        i < currentMonster.threatLevel ? "currentColor" : "none"
                      }
                      className={
                        i < currentMonster.threatLevel ? "text-yellow-400" : ""
                      }
                      aria-hidden="true"
                    />
                  ))}
                </div>
              }
            ></AttributeCard>
            <AttributeCard
              label={"Elemental Weakness"}
              labelClass="text-xs md:text-[16px]"
              value={
                <ElementalWeaknessCard
                  elements={currentMonster?.elementalWeakness}
                ></ElementalWeaknessCard>
              }
            ></AttributeCard>
            <AttributeCard
              label={"Blight / Elemental Damage"}
              labelClass="text-xs md:text-[16px]"
              value={
                <ElementCard
                  elements={currentMonster.blightElementalDamage}
                ></ElementCard>
              }
            ></AttributeCard>
            <AttributeCard
              label={"Abnormal Status"}
              labelClass="text-xs md:text-[16px]"
              value={
                <AbnormalCard
                  abnormalStatus={currentMonster.abnormalStatus}
                ></AbnormalCard>
              }
            ></AttributeCard>
          </div>
        </section>
        <section className="mt-1 box-border min-h-0 max-h-[40vh] w-full flex-1 overflow-y-auto py-2 flex flex-col items-center justify-start gap-2 border-2 border-black md:mt-0 md:w-1/2 md:max-h-none md:flex-1 md:justify-center ">
          <div className="relative flex justify-end items-center p-2 w-[90%]">
            <Search className="absolute right-[8%]" />
            <input
              type="text"
              className="w-3/5 h-[50px] border-1 border-solid border-black px-3"
              onChange={(e) => handleSearchMonster(e.target.value)}
            ></input>
          </div>
          <div className="bg-panel-background2 border-3 border-solid border-black rounded-[5px] w-[90%] custom-scrollbar min-h-0 overflow-y-auto md:max-h-[70vh]">
            {filteredMonsterList.map((item, index) => (
              <MonsterCard
                key={index}
                index={index + 1}
                name={item.name}
                selected={currentMonster.id === item.id}
                onClick={() => handleSelectMonster(item)}
              ></MonsterCard>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
