import Link from "next/link";
import { Doo } from "./Doo";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1.5 shrink-0" aria-label="Chalkadoo home">
      <Doo mood="smug" size={30} />
      <span className="comic text-[1.75rem] leading-none text-ink">
        Chalk<span className="text-blue">a</span>doo
      </span>
    </Link>
  );
}
