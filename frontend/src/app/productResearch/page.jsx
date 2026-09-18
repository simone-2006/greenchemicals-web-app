import { Search } from "lucide-react";
import Input from "@/components/ui/Input";

export default function ProductResearchPage() {
  return (
    <div className="w-full md:max-w-2xl px-4 sm:px-6 flex flex-col items-center pt-8 md:pt-6 pb-4 md:pb-6 md:mx-auto">
      <div className="flex items-center justify-center text-text mt-4 sm:mt-8 mb-4">
        <Search size={64} strokeWidth={2.5} aria-hidden="true" />
      </div>

      <h1 className="text-2xl font-bold leading-tight text-text whitespace-nowrap">
        Search for a product
      </h1>

      <p className="mb-2 text-text-secondary text-xs sm:text-sm text-center max-w-md">
        Search a product to see his information about stock/prices/orders
      </p>

      <div className="w-full max-w-md mt-2">
        <Input
          type="search"
          icon={<Search size={16} />}
          className="max-w-none"
          placeholder="Search..."
          autoComplete="off"
        />
      </div>

      <img
        src="/logo/GC_logo.jpg"
        className="h-14 sm:h-20 w-auto mt-8 select-none"
        alt="Greenchemicals"
      />
    </div>
  );
}
