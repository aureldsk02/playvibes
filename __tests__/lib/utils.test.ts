import { cn } from "@/lib/utils";

describe("cn utility function", () => {
    it("merges class names correctly", () => {
        const result = cn("text-red-500", "bg-blue-500");
        expect(result).toContain("text-red-500");
        expect(result).toContain("bg-blue-500");
    });

    it("handles conditional classes", () => {
        const isActive = true;
        const result = cn("base-class", isActive && "active-class");
        expect(result).toContain("base-class");
        expect(result).toContain("active-class");
    });

    it("removes falsy values", () => {
        const result = cn("base-class", false && "hidden", null, undefined, "visible");
        expect(result).toContain("base-class");
        expect(result).toContain("visible");
        expect(result).not.toContain("hidden");
    });

    it("handles Tailwind merge conflicts", () => {
        // tailwind-merge should resolve conflicting classes
        const result = cn("px-2", "px-4");
        // Should only contain px-4 (the last one)
        expect(result).toContain("px-4");
        expect(result).not.toContain("px-2");
    });

    it("handles empty input", () => {
        const result = cn();
        expect(result).toBe("");
    });

    it("handles arrays of classes", () => {
        const result = cn(["text-sm", "font-bold"], "text-blue-500");
        expect(result).toContain("text-sm");
        expect(result).toContain("font-bold");
        expect(result).toContain("text-blue-500");
    });
});
