import type { Metadata } from "next";

import SettingsClient from "@/components/SettingsClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Settings",
  path: "/settings",
});

export default function SettingsPage() {
  return <SettingsClient />;
}
