import type { Metadata } from "next";
import { PreferencesView } from "./PreferencesView";

export const metadata: Metadata = {
  title: "Discovery Preferences — HillBilly Dating",
};

export default function PreferencesPage() {
  return <PreferencesView />;
}
