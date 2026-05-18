import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="/brand/wendarca-logo.webp"
      alt="Wendarca"
      width={982}
      height={320}
      priority
      className="h-14 w-auto object-contain"
    />
  );
}
