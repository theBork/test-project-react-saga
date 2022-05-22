import React, { ReactElement, ReactNode } from "react";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "./store";

interface Children { children?: ReactNode }

function render(
  ui: ReactElement,
) {
  const store = createStore();
  function Wrapper({ children }: Children) {
    return <Provider {...{ store }}>{children}</Provider>;
  }

  return rtlRender(ui, { wrapper: Wrapper });
}

export * from "@testing-library/react";
export { render };
