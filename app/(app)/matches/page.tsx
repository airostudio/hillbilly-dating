import type { Metadata } from "next";
import { MatchesView } from "./MatchesView";

export const metadata: Metadata = {
  title: "Matches — HillBilly Dating",
};

export default function MatchesPage() {
  return <MatchesView />;
}
