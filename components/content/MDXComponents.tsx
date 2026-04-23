import Link from "next/link";
import type { Route } from "next";
import { isValidElement } from "react";
import type { HTMLAttributes, ReactNode } from "react";

import { slugifyHeading } from "@/lib/content/guideStructure";

function getNodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((child) => getNodeText(child)).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getNodeText(node.props.children as ReactNode);
  }

  return "";
}

function Heading({
  as: Tag,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & {
  as: "h2" | "h3" | "h4";
  children?: ReactNode;
}) {
  const id = slugifyHeading(getNodeText(children));

  return (
    <Tag
      id={id || undefined}
      className={["scroll-mt-28", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}

export const mdxComponents = {
  a: ({
    href = "#",
    children,
  }: {
    href?: string;
    children: ReactNode;
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
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => <Heading as="h2" {...props} />,
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => <Heading as="h3" {...props} />,
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => <Heading as="h4" {...props} />,
};
