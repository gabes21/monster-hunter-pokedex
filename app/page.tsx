"use client";
import AbnormalCard from "@/components/AbnormalCard";
import AttributeCard from "@/components/AttributeCard";
import ElementalCard from "@/components/ElementalCard";
import MonsterCard from "@/components/MonsterCard";
import { Monster } from "@/types";
import { Images, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentMonster, setCurrentMonster] = useState<Monster>({
    id: "",
    name: "",
    img: "",
    threatLevel: 0,
    elementalWeakness: {},
    abnormalStatus: [],
  });

  const maxThreatLevel = 10;
  const sampleData: Monster[] = [
    {
      id: "1",
      name: "Gore Magala",
      img: "/images/Gore_Magala.jpg",
      threatLevel: 7,
      abnormalStatus: ["frenzy"],
      elementalWeakness: {
        fire: {
          head: 15,
          neck: 15,
          torso: 10,
          wingarm: 20,
          foreleg: 25,
          hindleg: 10,
          wing: 15,
          tail: 10,
          antenna: 20,
        },
        thunder: {
          head: 15,
          neck: 10,
          torso: 5,
          wingarm: 15,
          foreleg: 5,
          hindleg: 5,
          wing: 10,
          tail: 10,
          antenna: 10,
        },
        dragon: {
          head: 15,
          neck: 5,
          torso: 5,
          wingarm: 10,
          foreleg: 5,
          hindleg: 5,
          wing: 5,
          tail: 5,
          antenna: 25,
        },
      },
    },
    {
      id: "2",
      name: "",
      img: "",
      threatLevel: 0,
      elementalWeakness: {},
      abnormalStatus: [],
    },
    {
      id: "3",
      name: "",
      img: "",
      threatLevel: 0,
      elementalWeakness: {},
      abnormalStatus: [],
    },
    {
      id: "4",
      name: "",
      img: "",
      threatLevel: 0,
      elementalWeakness: {},
      abnormalStatus: [],
    },
    {
      id: "5",
      name: "",
      img: "",
      threatLevel: 0,
      elementalWeakness: {},
      abnormalStatus: [],
    },
    {
      id: "6",
      name: "",
      img: "",
      threatLevel: 0,
      elementalWeakness: {},
      abnormalStatus: [],
    },
    {
      id: "7",
      name: "",
      img: "",
      threatLevel: 0,
      elementalWeakness: {},
      abnormalStatus: [],
    },
    {
      id: "8",
      name: "",
      img: "",
      threatLevel: 0,
      elementalWeakness: {},
      abnormalStatus: [],
    },
    {
      id: "9",
      name: "",
      img: "",
      threatLevel: 0,
      elementalWeakness: {},
      abnormalStatus: [],
    },
    {
      id: "10",
      name: "",
      img: "",
      threatLevel: 0,
      elementalWeakness: {},
      abnormalStatus: [],
    },
    {
      id: "11",
      name: "",
      img: "",
      threatLevel: 0,
      elementalWeakness: {},
      abnormalStatus: [],
    },
    {
      id: "12",
      name: "",
      img: "",
      threatLevel: 0,
      elementalWeakness: {},
      abnormalStatus: [],
    },
    {
      id: "13",
      name: "",
      img: "",
      threatLevel: 0,
      elementalWeakness: {},
      abnormalStatus: [],
    },
  ];

  const handleSelectMonster = (selectedMonster: Monster) => {
    console.log("selectedMonster: ", selectedMonster);
    setCurrentMonster(selectedMonster);
  };

  useEffect(() => {
    setCurrentMonster(sampleData[0]);
  }, []);
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <header className="flex flex-col justify-center items-center h-[10vh] bg-panel-background w-full">
        <h1 className="text-primary-text fire-red-font ">
          MONSTER HUNTER POKEDEX
        </h1>
      </header>

      <main className="flex flex-1 w-full flex-col items-center justify-start">
        <section className="border-2 border-black w-full min-h-[30vh] flex flex-col justify-center items-center px-10 py-4 gap-2">
          <div className="bg-panel-background border-1 border-black rounded-[5px] px-5 w-3/5 flex justify-center items-center">
            <div className="bg-white h-full w-[94%] rounded-[5px] text-center min-h-[25px]">
              <h1>{currentMonster.name || "???"}</h1>
            </div>
          </div>
          {currentMonster.img ? (
            <Image
              src={currentMonster.img}
              alt="Rathalos"
              width={300}
              height={200}
            />
          ) : (
            <div className="w-[300px] h-[200px] flex flex-col justify-center items-center bg-gray-500">
              <Images />
            </div>
          )}
          <div className="bg-panel-background border-1 border-solid w-full h-auto min-h-[100px] rounded-[5px] flex flex-col justify-center items-center gap-1">
            <AttributeCard
              label={"Threat Level"}
              labelClass="text-xs"
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
                        i < currentMonster.threatLevel
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }
                      aria-hidden="true"
                    />
                  ))}
                </div>
              }
            ></AttributeCard>
            <AttributeCard
              label={"Elemental Weakness"}
              labelClass="text-xs"
              value={
                <ElementalCard
                  elements={currentMonster.elementalWeakness}
                ></ElementalCard>
              }
            ></AttributeCard>
            <AttributeCard
              label={"Blight / Elemental Damage"}
              labelClass="text-xs"
            ></AttributeCard>
            <AttributeCard
              label={"Abnormal Status"}
              labelClass="text-xs"
              value={
                <AbnormalCard
                  abnormalStatus={currentMonster.abnormalStatus}
                ></AbnormalCard>
              }
            ></AttributeCard>
          </div>
        </section>
        <section className="w-4/5 h-full mt-1 max-h-[40vh] overflow-auto flex flex-col justify-start items-center gap-2 py-2">
          {sampleData.map((item, index) => (
            <MonsterCard
              key={index}
              index={index}
              name={item.name}
              selected={currentMonster.id === item.id}
              onClick={() => handleSelectMonster(item)}
            ></MonsterCard>
          ))}
        </section>
      </main>
    </div>
  );
}
