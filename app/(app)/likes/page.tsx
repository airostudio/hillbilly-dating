import type { Metadata } from "next";
import { LikesView } from "./LikesView";

export const metadata: Metadata = {
  title: "Likes — HillBilly Dating",
};

export default function LikesPage() {
  return <LikesView />;
}
