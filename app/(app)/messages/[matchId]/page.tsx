import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDemoProfileById } from "@/lib/demo-data";
import { MessagesShell } from "../MessagesShell";
import { ThreadView } from "./ThreadView";

export async function generateMetadata(props: PageProps<"/messages/[matchId]">): Promise<Metadata> {
  const { matchId } = await props.params;
  const profile = getDemoProfileById(matchId);
  return {
    title: profile ? `${profile.firstName} — Messages — HillBilly Dating` : "Messages — HillBilly Dating",
  };
}

export default async function MatchThreadPage(props: PageProps<"/messages/[matchId]">) {
  const { matchId } = await props.params;
  const profile = getDemoProfileById(matchId);
  if (!profile) notFound();

  return (
    <MessagesShell activeMatchId={matchId}>
      <ThreadView matchId={matchId} />
    </MessagesShell>
  );
}
