import Link from "next/link";
import type { Route } from "next";

export const mdxComponents = {
  a: ({
    href = "#",
    children,
  }: {
    href?: string;
    children: React.ReactNode;
  }) => {
    const isInternal = href.startsWith("/");

    if (isInternal) {
      return <Link href={href as Route}>{children}</Link>;
    }

    return (
      <a href={href} rel="noreferrer" target="_blank">
        {children}
      </a>
    );
  },
};
