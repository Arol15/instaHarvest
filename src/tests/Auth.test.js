import { render, screen } from "@testing-library/react";
import Auth from "../components/auth/Auth";

test("Auth login", () => {
  render(<Auth view="login" />);
  expect(screen.getByText("Log In")).toBeInTheDocument();
});
