import type { Metadata } from "next";
import { MyProfileView } from "./MyProfileView";

export const metadata: Metadata = {
  title: "Your Profile — HillBilly Dating",
};

export default function ProfilePage() {
  return <MyProfileView />;
}
