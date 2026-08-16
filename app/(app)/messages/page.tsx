import type { Metadata } from "next";
import { MessagesShell } from "./MessagesShell";

export const metadata: Metadata = {
  title: "Messages — HillBilly Dating",
};

export default function MessagesPage() {
  return <MessagesShell />;
}
