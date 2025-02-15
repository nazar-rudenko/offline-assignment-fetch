import { vi, expect, it, describe, beforeEach, afterAll } from "vitest";
import http, { QueryParams, serializeParams } from "./http";
import { URLS } from "./dogApi/consts.ts";

describe("serializeParams", () => {
  it("should serialize a query with simple parameters", () => {
    const params = { foo: "bar", baz: 42 };
    const result = serializeParams(params);
    expect(result).toBe("foo=bar&baz=42");
  });

  it("should handle array values", () => {
    const params = { arr: [1, 2, 3] };
    const result = serializeParams(params);
    expect(result).toBe("arr=1&arr=2&arr=3");
  });

  it("should handle sort parameter", () => {
    const params = { sort: { field: "name", order: "asc" } } as QueryParams;
    const result = serializeParams(params);
    expect(result).toBe("sort=name%3Aasc");
  });
});

describe("http", () => {
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);

  const mockResponse = (status: number, body: object | string) =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(body),
      headers: {
        get: (name: string) =>
          name === "Content-Type" ? "application/json" : null,
      },
    } as unknown as Response);

  beforeEach(() => {
    fetchMock.mockImplementation(() => mockResponse(200, {}));
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should send a GET request and return a response", async () => {
    const responseData = { data: "some data" };
    fetchMock.mockResolvedValueOnce(mockResponse(200, responseData));

    const result = await http({ path: "/test", method: "GET" });
    expect(result).toEqual(responseData);
    expect(fetchMock).toHaveBeenCalledWith(`${URLS.PROXY}/test`, {
      credentials: "include",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  });

  it("should handle 204 No Content response", async () => {
    fetchMock.mockResolvedValueOnce(mockResponse(204, ""));

    const result = await http({ path: "/test", method: "POST" });
    expect(result).toBeNull();
  });

  it("should throw an error for unsuccessful responses", async () => {
    const errorMessage = "Bad Request";
    fetchMock.mockResolvedValueOnce(mockResponse(400, errorMessage));

    try {
      await http({ path: "/test", method: "GET" });
    } catch (error: unknown) {
      expect((error as Error).message).toBe(
        "Network request failed 400: GET /test - Bad Request",
      );
    }
  });

  it("should correctly handle headers and body", async () => {
    const responseData = { data: "body test" };
    const customHeaders = { "Custom-Header": "value" };
    const body = { key: "value" };

    fetchMock.mockResolvedValueOnce(mockResponse(200, responseData));

    const result = await http({
      path: "/test",
      method: "POST",
      body,
      headers: customHeaders,
    });

    expect(result).toEqual(responseData);
    expect(fetchMock).toHaveBeenCalledWith(`${URLS.PROXY}/test`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Custom-Header": "value",
      },
      body: JSON.stringify(body),
    });
  });
});
