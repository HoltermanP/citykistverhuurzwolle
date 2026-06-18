import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BewerkProductPage({ params }: Props) {
  const { id } = await params;
  const [product] = await db.select().from(products).where(eq(products.id, Number(id)));

  if (!product) notFound();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-slate-900 font-black text-2xl">Product bewerken</h1>
        <p className="text-slate-500 text-sm mt-1">{product.naam}</p>
      </div>
      <ProductForm
        mode="bewerken"
        initieel={{
          id: product.id,
          naam: product.naam,
          slug: product.slug,
          artikelnummer: product.artikelnummer || "",
          categorie: product.categorie,
          beschrijving: product.beschrijving || "",
          kenmerken: (product.kenmerken as string[]) || [],
          prijsPerDag: String(product.prijsPerDag),
          isKoop: product.isKoop ?? false,
          beschikbaar: product.beschikbaar ?? true,
          populair: product.populair ?? false,
          volgorde: product.volgorde ?? 0,
          afbeeldingen:
            (product.afbeeldingen as string[])?.length
              ? (product.afbeeldingen as string[])
              : product.afbeeldingUrl
                ? [product.afbeeldingUrl]
                : [],
        }}
      />
    </div>
  );
}
