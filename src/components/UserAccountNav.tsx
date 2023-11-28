"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenu } from "./ui/dropdown-menu";

interface UserAccountNavProps {}

const UserAccountNav: React.FC<UserAccountNavProps> = ({}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild></DropdownMenuTrigger>
    </DropdownMenu>
  );
};

export default UserAccountNav;
