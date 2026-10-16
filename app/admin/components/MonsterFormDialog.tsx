"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { CustomDropDown } from "./CustomDropdown";
import {
  AbnormalStatusList,
  AbnormalStatusOptions,
  BodyPart,
  Element,
  ElementalWeakness,
  elementList,
  isAbnormalStatus,
  Monster,
  MonsterInput,
} from "@/types";
import { createMonster, updateMonster } from "@/app/services/monsterServices";
import { useRouter } from "next/navigation";

type Props = ({ mode: "add" } | { mode: "edit"; monster: Monster }) & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function MonsterFormDialog(props: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = props.open ?? internalOpen;
  const setOpen = props.onOpenChange ?? setInternalOpen;
  const MAX_IMAGE_SIZE = 1 * 1024 * 1024;
  const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Image must be PNG, JPEG or WebP");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image must be smaller than 5MB");
      e.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);
  };

  const handleOpenChange = (next: boolean) => {
    if (isSubmitting) return;
    setOpen(next);
    if (!next) {
      setImageFile(null);
      setError("");
    }
  };

  const bodyPartList: BodyPart[] = [
    "head",
    "neck",
    "torso",
    "wingarm",
    "foreleg",
    "hindleg",
    "wing",
    "tail",
    "antenna",
  ];
  const [name, setName] = useState(
    props.mode === "edit" && props.monster ? props.monster?.name : "",
  );
  const [threatLevel, setThreatlevel] = useState(
    props.mode === "edit" && props.monster ? props.monster?.threatLevel : 0,
  );
  const [abnormalStatusList, setAbnormalStatusList] =
    useState<AbnormalStatusList>(
      props.mode === "edit" && props.monster
        ? props.monster?.abnormalStatus
        : [],
    );
  const [abnormalStatusInput, setAbnormalStatusInput] = useState("");
  const [elementalWeaknessObject, setElementalWeaknessObject] =
    useState<ElementalWeakness>(
      props.mode === "edit" && props.monster
        ? props.monster.elementalWeakness
        : {},
    );
  const [selectedElement, setSelectedElement] = useState("");
  const elementalEntries = Object.entries(elementalWeaknessObject) as [
    Element,
    ElementalWeakness[Element],
  ][];

  const [error, setError] = useState("");

  const handleReset = () => {
    setName("");
    setThreatlevel(0);
    setAbnormalStatusInput("");
    setAbnormalStatusList([]);
    setElementalWeaknessObject({});
    setSelectedElement("");
  };

  const handleAddAbnormalStatusList = () => {
    const status = abnormalStatusInput.trim();

    if (isAbnormalStatus(status) && !abnormalStatusList.includes(status)) {
      setAbnormalStatusList((prev) => [...prev, status]);
      setAbnormalStatusInput("");
    }
  };

  const handleRemoveAbnormalStatus = (status: string) => {
    const newList = abnormalStatusList.filter((item) => item !== status);
    setAbnormalStatusList(newList);
  };
  //   const handleElementChange = (oldval: Element, newval: Element) => {
  //     if (newval === oldval) return;

  //     setElementalWeaknessObject((prev) => {
  //       if (!(oldval in prev)) return prev;
  //       if (newval in prev) return prev;

  //       const next = { ...prev };
  //       next[newval] = next[oldval];
  //       delete next[oldval];

  //       return next;
  //     });
  //   };

  const handleAddElementalWeakness = () => {
    setElementalWeaknessObject((prev) => {
      const availableElement = [
        "fire",
        "water",
        "thunder",
        "ice",
        "dragon",
      ].find((element) => !(element in prev)) as Element | undefined;

      if (!availableElement) return prev;

      if (!selectedElement || selectedElement in prev) {
        return prev;
      }

      const newElement = selectedElement;
      setSelectedElement("");

      return {
        ...prev,
        [selectedElement]: {},
      };
    });
  };

  const handleRemoveElementalWeakness = (element: Element) => {
    setElementalWeaknessObject((prev) => {
      const next = { ...prev };
      delete next[element];
      return next;
    });
  };

  const handleElementalBodyPartWeakness = ({
    ele,
    part,
    val,
  }: {
    ele: Element;
    part: BodyPart;
    val: number;
  }) => {
    setElementalWeaknessObject((prev) => {
      return {
        ...prev,
        [ele]: {
          ...prev[ele],
          [part]: val,
        },
      };
    });
  };

  const validator = () => {
    if (!name) {
      setError("Name is required");
      return false;
    } else if (!threatLevel) {
      setError("Threat level is required");
      return false;
    } else if (props.mode === "add" && !imageFile) {
      setError("Image is required");
      return false;
    }

    const checkElementIfGotEmpty = Object.entries(elementalWeaknessObject).some(
      ([element, bodyParts]) => {
        return !Object.values(bodyParts ?? {}).some(
          (value) => value !== undefined && value != null && value > 0,
        );
      },
    );

    if (checkElementIfGotEmpty) {
      setError(
        "At least one body part need to have value for the Elemental Weakness",
      );
      return false;
    }

    return true;
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setError("");

    if (!validator()) return;

    const body: MonsterInput = {
      name,
      threatLevel,
      abnormalStatus: abnormalStatusList,
      elementalWeakness: elementalWeaknessObject,
    };

    try {
      setIsSubmitting(true);
      if (props.mode === "edit" && props.monster) {
        await updateMonster(props.monster.id, body, imageFile);
      } else {
        await createMonster(body, imageFile!);
      }

      handleReset();
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(
        `Failed to ${props.mode === "edit" ? "update" : "add"} monster. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const existingImageUrl =
    props.mode === "edit" ? props.monster.imageUrl : null;
  const displayedImage = previewUrl ?? existingImageUrl;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {props.mode === "add" && (
        <DialogTrigger
          render={
            <Button variant="outline" className="text-[18px]">
              Add monster
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-sm h-[80vh] overflow-auto bg-panel-background2 border-4 border-white">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className={"text-[18px]"}>
              {props.mode === "edit" ? "Edit" : "Add"} monster
            </DialogTitle>
            {/* <DialogDescription>
            </DialogDescription> */}
          </DialogHeader>
          <fieldset
            disabled={isSubmitting}
            className="min-w-0 border-0 p-0 m-0"
          >
            <FieldGroup>
              <Field>
                <Label htmlFor="name-1">Name</Label>
                <Input
                  id="name-1"
                  name="name"
                  className="font-[Arial,sans-serif]"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </Field>
              <Field>
                <Label htmlFor="threatLevel">Threat Level</Label>
                <Input
                  id="threatLevel"
                  type="number"
                  name="threatLevel"
                  className="font-[Arial,sans-serif]"
                  required
                  onChange={(e) => setThreatlevel(Number(e.target.value))}
                  value={threatLevel}
                />
              </Field>

              <Field>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  className="font-[Arial,sans-serif]"
                  onChange={handleImageChange}
                />
                {displayedImage && (
                  <div className="relative w-full">
                    <img
                      src={displayedImage}
                      alt="Monster preview"
                      className="w-full max-h-48 object-contain rounded-[5px] bg-white"
                    />
                    <X
                      className="text-red-500 hover:text-red-900 active:scale-105 cursor-pointer absolute top-1 right-1"
                      onClick={() => setImageFile(null)}
                    />
                  </div>
                )}
              </Field>
              <Field>
                <Label htmlFor="abnormalStatus">Abnormal Status</Label>
                <p className="font-[Arial,sans-serif] italic text-[10px]">
                  Please click add abnormal status button to add the status to
                  the monster
                </p>
                <div className="flex justify-start items-center gap-2 overflow-auto">
                  {abnormalStatusList?.map((item, index) => (
                    <div
                      className="border-1 border-black bg-white text-black rounded-[5px] px-2 flex justify-between items-center"
                      key={index}
                    >
                      {item}
                      <X
                        className="text-red-500 hover:text-red-900 active:scale-105 cursor-pointer"
                        onClick={() => handleRemoveAbnormalStatus(item)}
                      />
                    </div>
                  ))}
                </div>

                <CustomDropDown
                  text1={"Select an abnormal status"}
                  text2={"Abnormal Status List"}
                  optionList={AbnormalStatusOptions}
                  element={abnormalStatusInput}
                  onValueChange={(newval) => setAbnormalStatusInput(newval)}
                />

                <div className="flex justify-end items-center">
                  <Button
                    type="button"
                    onClick={() => handleAddAbnormalStatusList()}
                  >
                    Add Abnormal Status
                  </Button>
                </div>
              </Field>
              <Field>
                <Label htmlFor="threatLevel">Elemental Weakness</Label>
                {elementalEntries.map(([element, bodyParts]) => (
                  <div
                    key={element}
                    className="bg-panel-background px-3 pt-2 pb-4 rounded-[5px] relative"
                  >
                    <div className="w-full flex justify-center items-center">
                      <div className="bg-white text-black rounded-[5px] border-1 border-black px-4 py-2">
                        {element}
                      </div>
                      <X
                        className="text-red-500 hover:text-red-900 active:scale-105 cursor-pointer absolute right-2"
                        onClick={() => handleRemoveElementalWeakness(element)}
                      />
                    </div>

                    <FieldGroup className="flex-col justify-center items-center px-10 mt-3">
                      {bodyPartList.map((item, index) => {
                        return (
                          <Field
                            className="flex-row justify-center items-center"
                            key={index}
                          >
                            <label htmlFor={`${item}-${element}`}>
                              {" "}
                              {item.charAt(0).toUpperCase() + item.slice(1)}
                            </label>
                            <input
                              id={`${item}-${element}`}
                              type="number"
                              min={0}
                              className="border-1 border-black rounded-[12px]"
                              value={bodyParts?.[item] ?? ""}
                              onChange={(e) => {
                                handleElementalBodyPartWeakness({
                                  ele: element,
                                  part: item,
                                  val: Number(e.target.value),
                                });
                              }}
                            ></input>
                          </Field>
                        );
                      })}
                    </FieldGroup>
                  </div>
                ))}
                <div className="w-full flex justify-between items-center">
                  <CustomDropDown
                    optionList={elementList}
                    element={selectedElement}
                    onValueChange={(newval) => setSelectedElement(newval)}
                  />
                </div>
                <div className="flex justify-end items-center">
                  <Button
                    type="button"
                    onClick={() => handleAddElementalWeakness()}
                  >
                    Add Elemental Weakness
                  </Button>
                </div>
              </Field>
            </FieldGroup>
          </fieldset>
          <DialogFooter>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <DialogClose
              render={
                <Button variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              }
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
