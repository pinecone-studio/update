import Image from "next/image";

export const Header = () => {
  return (
    <div className="">
      <Image src="/logo.png" width={40} height={40} alt="logo" />
    </div>
  );
};