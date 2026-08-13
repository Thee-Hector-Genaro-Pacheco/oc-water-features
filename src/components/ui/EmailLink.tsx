"use client";

import React from "react";
import { companyData } from "@/data/company";
import { trackEmailClick } from "@/lib/analytics/events";

interface EmailLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  locationLabel?: string;
  children: React.ReactNode;
}

export const EmailLink: React.FC<EmailLinkProps> = ({
  locationLabel = "header",
  children,
  onClick,
  className,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackEmailClick(locationLabel);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={`mailto:${companyData.emailDisplay}`}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
};
