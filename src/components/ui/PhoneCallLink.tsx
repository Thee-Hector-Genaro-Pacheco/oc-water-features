"use client";

import React from "react";
import { companyData } from "@/data/company";
import { trackPhoneCallClick } from "@/lib/analytics/events";

interface PhoneCallLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  locationLabel?: string;
  children: React.ReactNode;
}

export const PhoneCallLink: React.FC<PhoneCallLinkProps> = ({
  locationLabel = "header",
  children,
  onClick,
  className,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackPhoneCallClick(locationLabel);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={companyData.phoneRaw}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
};
