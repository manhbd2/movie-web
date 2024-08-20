import { ReactNode } from "react";

export function Layout(props: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col">{props.children}</div>;
}
