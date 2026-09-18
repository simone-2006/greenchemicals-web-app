import Title from "@/components/layout/Title";
import { Container } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { CornerDownLeft } from "lucide-react";
import { Search } from "lucide-react";

export default function ContainersPage() {
  return (
    <>
      <Title subtitle={"Here you can search a container and check its status and information"} icon={<Container />}>
        Containers
      </Title>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            icon={<Search size={16} />}
            placeholder="Search container number..."
          />
          <Button variant="superPrimary">
            <CornerDownLeft size={16} />
            Search
          </Button>
        </div>

        {/* Container	Supplier	Product code	Description	Number	Quantity	Batch	Batch quantity	MED */}
      </div>
        <table className="mt-2">
          <tr className="uppercase text-text font-normal">
            <th className="w-1/9 text-center">Container</th>
            <th className="w-1/9 text-center">Supplier</th>
            <th className="w-1/9 text-center">Product code</th>
            <th className="w-1/9 text-center">Description</th>
            <th className="w-1/9 text-center">Number</th>
            <th className="w-1/9 text-center">Quantity</th>
            <th className="w-1/9 text-center">Batch</th>
            <th className="w-1/9 text-center">Batch quantity</th>
            <th className="w-1/9 text-center">MED</th>
          </tr>
        </table>

    </>
  );
}