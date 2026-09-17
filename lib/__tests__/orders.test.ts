import { describe, expect, it } from "vitest";

import { buildOrderSummary } from "../orders";

describe("buildOrderSummary", () => {
  it("resume un pedido vacío", () => {
    expect(buildOrderSummary([], 0)).toEqual({
      subtotal: 0,
      discount: 0,
      taxable: 0,
      tax: 0,
      total: 0,
      display: {
        subtotal: "$0.00",
        discount: "$0.00",
        taxable: "$0.00",
        tax: "$0.00",
        total: "$0.00",
      },
    });
  });

  it("resume varias líneas con descuento", () => {
    expect(
      buildOrderSummary(
        [
          { productId: "prod-001", quantity: 2, unitPrice: 100 },
          { productId: "prod-002", quantity: 1, unitPrice: 51 },
        ],
        10,
      ),
    ).toEqual({
      subtotal: 251,
      discount: 25,
      taxable: 226,
      tax: 36,
      total: 262,
      display: {
        subtotal: "$251.00",
        discount: "$25.00",
        taxable: "$226.00",
        tax: "$36.00",
        total: "$262.00",
      },
    });
  });

  it("conserva el redondeo de un descuento decimal sobre un subtotal impar", () => {
    expect(
      buildOrderSummary(
        [{ productId: "prod-003", quantity: 1, unitPrice: 101 }],
        12.5,
      ),
    ).toEqual({
      subtotal: 101,
      discount: 13,
      taxable: 88,
      tax: 14,
      total: 102,
      display: {
        subtotal: "$101.00",
        discount: "$13.00",
        taxable: "$88.00",
        tax: "$14.00",
        total: "$102.00",
      },
    });
  });
});
