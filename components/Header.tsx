"use client";
import { usePathname, useRouter } from "next/navigation";
import { NavigationDropdown } from "./NavigationDropdown";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

const Header = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }
  return (
    <header className="flex flex-col justify-center items-center h-[10vh] bg-panel-background w-full relative">
      <h1 className="text-primary-text fire-red-font md:text-[24px]">
        MONSTER HUNTER POKEDEX
      </h1>
      <div className="absolute right-[2.5%] bottom-[10%] md:hidden">
        <NavigationDropdown></NavigationDropdown>
      </div>
      <div className="flex justify-end items-center gap-4 w-full px-4 hidden md:flex w-3/5 absolute bottom-[10%]">
        <Link
          href="/"
          className={
            pathname === "/"
              ? "border-black border-1 border-solid text-white px-2"
              : "text-black hover:bg-blue-500 hover:text-white"
          }
        >
          Homepage
        </Link>
        <Link
          href="/admin"
          className={
            pathname === "/admin" || pathname === "/admin/monster"
              ? "border-black border-1 border-solid text-white px-2"
              : "text-black hover:bg-blue-500 hover:text-white"
          }
        >
          Admin
        </Link>
        {isLoggedIn && (
          <div className="bg-gray-700 border-2 border-black p-2">
            <LogOut
              onClick={handleLogout}
              className="bg-black-300 cursor-pointer active:scale-105"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
