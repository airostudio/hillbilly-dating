import type { Metadata } from "next";
import { DiscoverView } from "./DiscoverView";

export const metadata: Metadata = {
  title: "Discover — HillBilly Dating",
};

export default function DiscoverPage() {
  return <DiscoverView />;
}
