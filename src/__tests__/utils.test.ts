import { computeSuperProperties } from "../utils";
import { ParsedTrackEvent } from "../../types/event";

describe("Utils", () => {
  describe("Super Properties", () => {
    const exampleAlice: ParsedTrackEvent = {
      sentAt: 0,
      domain: "example",
      event: "Test",
      properties: {
        name: "alice"
      }
    };

    const exampleBob: ParsedTrackEvent = {
      sentAt: 0,
      domain: "example",
      event: "Test",
      properties: {
        name: "bob"
      }
    };

    const actualCharlie: ParsedTrackEvent = {
      sentAt: 0,
      domain: "example",
      event: "Actual Test",
      properties: {
        name: "bob"
      }
    };
    it("returns an empty array when only one event passed", () => {
      const result = computeSuperProperties([exampleAlice]);
      expect(result).toHaveLength(0);
    });
    it("returns an empty array when only one event type", () => {
      const result = computeSuperProperties([exampleAlice, exampleBob]);
      expect(result).toHaveLength(0);
    });

    it("returns an array with 'name' when all events share property", () => {
      const [result] = computeSuperProperties([
        exampleAlice,
        exampleBob,
        actualCharlie
      ]);
      expect(result).toEqual("name");
    });
  });
});
