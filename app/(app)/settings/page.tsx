import type { Metadata } from "next";
import { SettingsView } from "./SettingsView";

export const metadata: Metadata = {
  title: "Account Settings — HillBilly Dating",
};

export default function SettingsPage() {
  return <SettingsView />;
}
