"use client"
import Title from "@/components/layout/Title";
import { Building2, FunnelX, Plus } from "lucide-react";

import CustomerTable from "@/components/ui/customer/CustomerTable";
import Button from "@/components/ui/Button";

import Modal from "@/components/layout/Modal";
import Form from "@/components/ui/Form";
import Input from "@/components/ui/Input";

import { useState } from "react";

export default function CustomerPage() {
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <Title icon={<Building2 size={20} />} subtitle="Here you can manage customers">
            Customers
          </Title>
          <Button variant="ghost">
            <Building2 size={16} />
            View all customers
          </Button>
          <Button variant="ghost">
            <FunnelX size={16} />
            Clear filter
          </Button>
        </div>

        <Button variant="primary" onClick={() => setAddCustomerOpen(true)}>
          <Building2 size={16} />
          <Plus size={12} />
          Add customer
        </Button>
      </div>

      <div className="min-h-0 flex-1" style={{ minHeight: 480 }}>
        <CustomerTable />
      </div>


      <Modal show={addCustomerOpen} onClose={() => setAddCustomerOpen(false)}>
        <Form
          fields={[
            { name: "customerName", label: "Customer name", type: "text", required: true },
            { name: "agent", label: "Agent", type: "text" },
            { name: "country", label: "Country", type: "text" },
            { name: "town", label: "Town", type: "text" },
            { name: "address", label: "Address", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Phone number", type: "text" },
            { name: "familyCode", label: "Family code", type: "text" },
            {
              name:"mapcolor",
              label:"Map color",
              render: ({ value, onChange }) => {
                const colors = [
                  { name: "red",    hex: "#ca283f" },
                  { name: "black",  hex: "#3c3c3c" },
                  { name: "blue",   hex: "#2981ca" },
                  { name: "yellow", hex: "#cbc526" },
                  { name: "green",  hex: "#28ad24" },
                  { name: "gold",   hex: "#fed224" },
                  { name: "orange", hex: "#cb842a" },
                  { name: "violet", hex: "#9a25ca" },
                  { name: "grey",   hex: "#7a7a7a" },
                ];
                return (
                  <div className="flex gap-2 flex-wrap">
                    {colors.map(({ name, hex }) => (
                      <div
                        key={name}
                        className={`color-swatch w-7 h-7 rounded-md cursor-pointer transition-all border-2 ${
                          value === name ? "p-3 selected" : "border-transparent"
                        }`}
                        data-color={name}
                        style={{ backgroundColor: hex }}
                        tabIndex={0}
                        onClick={() => onChange(name)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            onChange(name);
                          }
                        }}
                        aria-label={name}
                      ></div>
                    ))}
                  </div>
                );
              }
            },
            {
              name: "customerSupplier",
              label: "Customer/Supplier",
              colSpan: 2,
              render: ({ value = {}, onChange }) => (
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-text">
                    <input
                      type="checkbox"
                      checked={!!value.customer}
                      onChange={e => onChange({ ...value, customer: e.target.checked })}
                    />
                    Customer
                  </label>
                  <label className="flex items-center gap-2 text-text">
                    <input
                      type="checkbox"
                      checked={!!value.supplier}
                      onChange={e => onChange({ ...value, supplier: e.target.checked })}
                    />
                    Supplier
                  </label>
                </div>
              )
            },
            { name: "note", label: "Note", type: "textarea", colSpan: 2 },
          ]}
     
          defaultValues={{ attivo: true }}
          onSubmit={(data) => console.log(data)}
          showCancel
          onCancel={() => { }}
        />
      </Modal>
    </div>
  );
}
