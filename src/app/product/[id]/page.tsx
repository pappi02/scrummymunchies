import { getMenuItems } from "@/lib/menu";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  const items = getMenuItems();
  return items.map((item) => ({
    id: item.id,
  }));
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  return <ProductDetailClient params={params} />;
}
