import Title from "@/components/layout/Title";
import { Map } from "lucide-react";
import Switch from "@/components/ui/Switch";

export default function page() {

  return (
    <div className="flex items-center gap-2">
      <Title icon={<Map />} subtitle={
        "Visual overview of your customers"
      }>
        Customer map
      </Title>

      <div className="flex items-center gap-1 border border-border p-1">
        Mine
        <Switch/>
        All
      </div>
    </div>
  );
}