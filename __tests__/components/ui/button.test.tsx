import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import userEvent from "@testing-library/user-event";

describe("Button Component", () => {
    it("renders button with text", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
    });

    it("handles click events", async () => {
        const handleClick = jest.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByRole("button", { name: /click me/i });
        await user.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("applies variant styles correctly", () => {
        const { rerender } = render(<Button variant="default">Default</Button>);
        let button = screen.getByRole("button");
        expect(button).toHaveClass("bg-primary");

        rerender(<Button variant="outline">Outline</Button>);
        button = screen.getByRole("button");
        expect(button).toHaveClass("border");
    });

    it("applies size styles correctly", () => {
        const { rerender } = render(<Button size="default">Default</Button>);
        let button = screen.getByRole("button");
        expect(button).toHaveClass("h-10");

        rerender(<Button size="sm">Small</Button>);
        button = screen.getByRole("button");
        expect(button).toHaveClass("h-9");
    });

    it("can be disabled", () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
        expect(button).toHaveClass("disabled:opacity-50");
    });

    it("renders as child component when asChild is true", () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        );
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/test");
    });
});
