import Title from "@/components/layout/Title";
import { Building2, FunnelX, Plus } from "lucide-react";

import Button from "@/components/ui/Button";

export default function page() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Title icon={<Building2 size={20} />} subtitle="Here you can manage customers">Customers </Title>
          <Button variant="ghost">
            <Building2 size={16} />
            View all customers
          </Button>
          <Button variant="ghost">
            <FunnelX size={16} />
            Clear filter
          </Button>
        </div>

        <Button variant="primary">
          <Building2 size={16} />
          <Plus size={12}></Plus>
          Add customer
        </Button>
      </div>
    </div>
  );
}