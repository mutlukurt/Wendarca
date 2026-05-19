import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-14 w-auto object-contain" }: LogoProps) {
  return (
    <Image
      src="/brand/wendarca-logo.webp"
      alt="Wendarca"
      width={732}
      height={239}
      priority
      className={className}
    />
  );
}
