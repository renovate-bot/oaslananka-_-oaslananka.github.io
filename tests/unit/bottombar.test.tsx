import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Bottombar from "@/components/Bottombar";

describe("Bottombar", () => {
  it("uses a semantic button for the terminal toggle", () => {
    const onTerminalToggle = vi.fn();

    render(
      <Bottombar onTerminalToggle={onTerminalToggle} isTerminalOpen={false} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle terminal" }));
    expect(onTerminalToggle).toHaveBeenCalledTimes(1);
  });
});
