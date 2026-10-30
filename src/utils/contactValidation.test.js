import { describe, expect, it } from "vitest";
import { isEmail, validateContact, validatePhone } from "./contactValidation";

const valid = {
  name: "Jane Rivera",
  email: "jane@company.com",
  message: "We schedule intake over text messages.",
};

describe("validatePhone", () => {
  it("treats an empty number or a bare country code as not provided", () => {
    expect(validatePhone({ digits: "", dialCode: "1" })).toBeNull();
    expect(validatePhone({ digits: "44", dialCode: "44" })).toBeNull();
    expect(validatePhone()).toBeNull();
  });

  it("requires 11 digits for North American numbers", () => {
    expect(validatePhone({ digits: "19545592944", dialCode: "1" })).toBeNull();
    expect(validatePhone({ digits: "1954559294", dialCode: "1" })).toMatch(/complete phone number/);
  });

  it("accepts international numbers that are not 10 local digits", () => {
    expect(validatePhone({ digits: "447700900123", dialCode: "44" })).toBeNull(); // UK mobile
    expect(validatePhone({ digits: "34612345678", dialCode: "34" })).toBeNull(); // Spain, 9 local digits
    expect(validatePhone({ digits: "573001234567", dialCode: "57" })).toBeNull(); // Colombia
    expect(validatePhone({ digits: "4930123456789", dialCode: "49" })).toBeNull(); // Germany, 11 local digits
  });

  it("rejects numbers that are too short or longer than E.164 allows", () => {
    expect(validatePhone({ digits: "44123", dialCode: "44" })).not.toBeNull();
    expect(validatePhone({ digits: "4412345678901234", dialCode: "44" })).not.toBeNull();
  });
});

describe("validateContact", () => {
  it("passes a complete submission", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("flags each missing or invalid field", () => {
    const errors = validateContact({
      name: " ",
      email: "jane@",
      message: "short",
      phone: { digits: "1954", dialCode: "1" },
    });
    expect(Object.keys(errors).sort()).toEqual(["email", "message", "name", "phone"]);
  });

  it("checks email format", () => {
    expect(isEmail("a@b.co")).toBe(true);
    expect(isEmail("a@b")).toBe(false);
    expect(isEmail("a b@c.com")).toBe(false);
  });
});
