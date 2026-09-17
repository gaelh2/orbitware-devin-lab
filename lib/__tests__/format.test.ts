import { describe, expect, it } from "vitest";
import { formatCurrency } from "../format";

describe("formatCurrency", () => {
  it("formatea 100 MXN para es-MX", () => {
    expect(formatCurrency(100)).toBe("$100.00");
  });
});
