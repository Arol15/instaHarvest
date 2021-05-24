import { render as rtlRender, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { Provider, connect } from "react-redux";
import { createStore } from "redux";

import Home from "../components/Home";
import reducer from "../store/currentPageSlice";

const initialReducerState = { homePage: false };

const render = (
  ui,
  {
    initialState = initialReducerState,
    store = createStore(reducer, initialState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

test("Home component", () => {
  render(<Home />);
  expect(
    screen.getByText((content, element) => {
      return element.id === "w1" && content.startsWith("Find homegrown");
      //   "Find homegrown fruits and vegetables"
    })
  );
});
