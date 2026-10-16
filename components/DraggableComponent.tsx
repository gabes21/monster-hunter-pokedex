"use client";

import { useEffect, useRef } from "react";

const DraggableComponent = () => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    const parent = parentRef.current;

    if (!element || !parent) return;

    let isDragging = false;
    let x = 0;
    let y = 0;

    const onPointerDown = (event: PointerEvent): void => {
      const elementRect = element.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();

      // Get the actual visual position, even if an animation
      // was interrupted by a new pointer down.
      x = elementRect.left - parentRect.left;
      y = elementRect.top - parentRect.top;

      // Stop any ongoing snap animation at its current position.
      element.style.transition = "none";
      element.style.transform = `translate(${x}px, ${y}px)`;

      isDragging = true;
      element.style.cursor = "grabbing";
      element.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent): void => {
      if (!isDragging) return;

      x += event.movementX;
      y += event.movementY;

      element.style.transform = `translate(${x}px, ${y}px)`;
    };

    const onPointerUp = (): void => {
      if (!isDragging) return;
      isDragging = false;

      const elementRect = element.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();

      const distanceLeft = elementRect.left - parentRect.left;
      const distanceRight = parentRect.right - elementRect.right;

      const targetX =
        distanceLeft < distanceRight
          ? 0
          : parent.clientWidth - element.offsetWidth;

      element.style.transition = "transform 300ms ease-out";

      x = targetX;

      element.style.transform = `translate(${x}px, ${y}px)`;

      element.style.cursor = "grab";
    };

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);

    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div ref={parentRef} className="absolute inset-0 z-50 pointer-events-none">
      <div
        ref={elementRef}
        className="absolute left-0 top-0 h-[50px] w-[50px] bg-blue-300 pointer-events-auto cursor-grab touch-none"
      />
    </div>
  );
};

export default DraggableComponent;
