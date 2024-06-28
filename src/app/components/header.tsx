import Link from "next/link";
import type { FC } from "react";
import ThemeToggle from "./common/ThemeSwitcher";
import FilterSection from "./common/FIlterSection";

interface Props {}

const Header: FC<Props> = () => {
  return (
    <>
      <nav className="h-[80px] bg-slate-600 flex justify-between items-center text-xl text-white px-10">
        <div>
          <Link href={"/"}>Expanse</Link>
        </div>

        <div className="flex">
          <ThemeToggle />
          Clear
        </div>
      </nav>
      <FilterSection />
    </>
  );
};

export default Header;
