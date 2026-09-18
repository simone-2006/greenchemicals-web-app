import Title from "@/components/layout/Title";
import { Contact, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { UserPlus } from "lucide-react";
import Input from "@/components/ui/Input";

export default function ContactsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <Title subtitle={"Here you can search a contact and check its information"} icon={<Contact />}>
          Contacts
        </Title>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
          >
            <UserPlus />
            Add contact
          </Button>
          <Input
              type="search"
              variant="ghost"
              icon={<Search size={16} />}
              placeholder="Search contact or customer"
              autoComplete="off"
            />
        </div>
      </div>
    </>
  );
}