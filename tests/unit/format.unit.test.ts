import { expect, test } from "@playwright/test";

import { formatDate, toCurrency, toNumber } from "../../src/app/utils/format";

test.describe("CP-18 - utils/format", () => {
  test("CP-18 - formatear numeros moneda y fechas", async ({ }, testInfo) => {
    expect(toNumber("1500")).toBe(1500);
    expect(toNumber("19.99")).toBe(19.99);
    expect(toNumber(42)).toBe(42);
    expect(toNumber("")).toBe(0);
    expect(toNumber("precio")).toBe(0);
    expect(toNumber(Number.NaN)).toBe(0);
    expect(toNumber(Number.POSITIVE_INFINITY)).toBe(0);
    expect(toCurrency(1500)).toBe("1.500");
    expect(toCurrency(1250000)).toBe("1.250.000");
    expect(toCurrency(1250000, "en-US")).toBe("1,250,000");
    expect(formatDate("2026-06-28T12:00:00.000Z")).toBe("28 de junio de 2026");
    expect(formatDate("2026-06-28T12:00:00.000Z", "en-US")).toBe("June 28, 2026");
  });
});
