"use client";

import { PRODUCT_CATEGORIES } from "@/config";
import { useEffect, useRef, useState } from "react";
import NavItem from "./NavItem";
import { useOnClickOutside } from "@/hooks/use-onClickOutside";

interface NavItemsProps {}

const NavItems: React.FC<NavItemsProps> = ({}) => {
  const [activeIndex, setActiveIndex] = useState<null | number>(null);

  /***
    1. handle clicking outside nav ref
    which suppose too close the nav if it's open

    this uses the useOnClickOutside hook which is a custom hook

    2. close the nav when pressing the escape key
    @see
    - @/hooks/use-onClickOutside
  */
  const navRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(navRef, () => {
    setActiveIndex(null);
  });

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
    };

    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  return (
    <div ref={navRef} className="flex gap-4 h-full">
      {PRODUCT_CATEGORIES.map((category, index) => {
        // Keep track of which item in the navbar is active (opened)
        const handleOpen = () => {
          if (activeIndex === index) {
            setActiveIndex(null);
          } else {
            setActiveIndex(index);
          }
        };

        const isOpen = activeIndex === index;

        return (
          <NavItem
            key={category.value}
            category={category}
            handleOpen={handleOpen}
            isOpen={isOpen}
            isAnyOpened={activeIndex !== null}
          />
        );
      })}
    </div>
  );
};

export default NavItems;
