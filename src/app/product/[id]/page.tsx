import { getMenuItems } from "@/lib/menu";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  const items = getMenuItems();
  return items.map((item) => ({
    id: item.id,
  }));
}

// Next.js 15+: dynamic route params are passed as a Promise.
export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailClient params={{ id }} />;
}
