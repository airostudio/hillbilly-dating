import type { Metadata } from "next";
import { EditProfileView } from "./EditProfileView";

export const metadata: Metadata = {
  title: "Edit Profile — HillBilly Dating",
};

export default function EditProfilePage() {
  return <EditProfileView />;
}
