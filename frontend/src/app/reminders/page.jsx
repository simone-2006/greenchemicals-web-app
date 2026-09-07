import Title from "@/components/layout/Title";
import { Bell } from "lucide-react";


export default function RemindersPage() {
  return (
    <Title icon={<Bell />} subtitle={"Here you can manage your reminders"}>
      Reminders
    </Title>
  );
}