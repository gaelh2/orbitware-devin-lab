export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
};

export type OrderLine = {
  productId: Product["id"];
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  deliveryDate: string;
  status: "draft" | "confirmed" | "shipped" | "cancelled";
  lines: OrderLine[];
};
