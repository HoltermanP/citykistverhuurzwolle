import ProductForm from "@/components/ProductForm";

export default function NieuwProductPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-slate-900 font-black text-2xl">Nieuw product</h1>
        <p className="text-slate-500 text-sm mt-1">Voeg een nieuw verhuurartikel toe</p>
      </div>
      <ProductForm mode="nieuw" />
    </div>
  );
}
