import Image from "next/image";
import { assetPath } from "../lib/assets";

export function ApilayerLogo({
  className,
  priority,
}: {
  className: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={assetPath("/apilayer-logo.png")}
      alt="APILayer"
      width={600}
      height={116}
      priority={priority}
      className={`${className} w-auto dark:brightness-0 dark:invert`}
    />
  );
}
