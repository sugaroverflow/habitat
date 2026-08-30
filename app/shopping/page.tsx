import { ShoppingBagOpen } from "@phosphor-icons/react/dist/ssr";
import { Suspense } from "react";

import { ItemCard } from "@/components/features/item-card";
import { ThriftFindCapture } from "@/components/features/thrift-find-capture";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { normalizeItemStatus } from "@/lib/data";
import { seedData } from "@/lib/seed-data";

export const metadata = { title: "All items" };

function ProductGrid({ items }: { items: typeof seedData.items }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-5 py-12 text-center">
        <ShoppingBagOpen aria-hidden="true" size={26} className="mx-auto text-muted-foreground" />
        <p className="mt-3 text-sm font-semibold">No items here yet</p>
        <p className="mt-1 text-xs text-muted-foreground">Add an item from its room or capture an in-person find.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}

export default function ShoppingPage() {
  const shopping = seedData.items.filter((item) => item.ownership_status !== "owned");
  const active = shopping.filter((item) => !["rejected", "ordered", "arrived"].includes(normalizeItemStatus(item)));
  const favourites = shopping.filter((item) => normalizeItemStatus(item) === "favourite");
  const ordered = shopping.filter((item) => normalizeItemStatus(item) === "ordered");
  const rejected = shopping.filter((item) => normalizeItemStatus(item) === "rejected");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`${shopping.length} items`}
        title="All items"
        description="Browse every candidate and purchase. Compare options inside each room."
        action={
          <Suspense fallback={<div className="h-10 w-28 rounded-full bg-muted" />}>
            <ThriftFindCapture />
          </Suspense>
        }
      />
      <Tabs defaultValue="active">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <TabsList>
            <TabsTrigger value="active">Considering {active.length}</TabsTrigger>
            <TabsTrigger value="favourites">Top picks {favourites.length}</TabsTrigger>
            <TabsTrigger value="ordered">Ordered {ordered.length}</TabsTrigger>
            <TabsTrigger value="rejected">Passed {rejected.length}</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="active"><ProductGrid items={active} /></TabsContent>
        <TabsContent value="favourites"><ProductGrid items={favourites} /></TabsContent>
        <TabsContent value="ordered"><ProductGrid items={ordered} /></TabsContent>
        <TabsContent value="rejected"><ProductGrid items={rejected} /></TabsContent>
      </Tabs>
    </div>
  );
}
