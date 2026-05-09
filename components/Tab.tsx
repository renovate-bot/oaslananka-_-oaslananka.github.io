"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import styles from "@/styles/Tab.module.css";

interface TabProps {
  icon: string;
  filename: string;
  path: string;
}

const Tab = ({ icon, filename, path }: TabProps) => {
  const pathname = usePathname();

  return (
    <Link
      href={path}
      className={`${styles.tab} ${pathname === path && styles.active}`}
    >
      <Image src={icon} alt="" height={18} width={18} aria-hidden="true" />
      <p>{filename}</p>
    </Link>
  );
};

export default Tab;
