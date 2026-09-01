import {
  IconDashboard,
  IconLawyer,
  IconClient,
  IconMatter,
  IconInCharge,
  IconTime,
  IconDisbursement,
  IconLeave,
  IconInvoice,
  IconSettings,
  IconReport,
  IconSubadmin,
} from "./icons";

export type NavItem = {
  label: string;
  href?: string;
  icon: (props: { className?: string }) => React.ReactElement;
  children?: { label: string; href: string }[];
  adminOnly?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: IconDashboard },
  {
    label: "Lawyer Management",
    icon: IconLawyer,
    children: [
      { label: "Lawyer List", href: "/lawyers" },
      { label: "Add Lawyer", href: "/lawyers/new" },
    ],
  },
  {
    label: "Client Management",
    icon: IconClient,
    children: [
      { label: "Client List", href: "/clients" },
      { label: "Add Client", href: "/clients/new" },
    ],
  },
  { label: "Matter List", href: "/matters", icon: IconMatter },
  { label: "In charge", href: "/in-charge", icon: IconInCharge },
  {
    label: "Time Management",
    icon: IconTime,
    children: [
      { label: "Add TimeRecord", href: "/time-records/new" },
      { label: "TimeRecord List", href: "/time-records" },
      { label: "Report Generate", href: "/time-records/report" },
    ],
  },
  { label: "Disbursement Management", href: "/disbursements", icon: IconDisbursement },
  {
    label: "Leave Management",
    icon: IconLeave,
    children: [
      { label: "Leave List", href: "/leaves" },
      { label: "Apply Leave", href: "/leaves/new" },
    ],
  },
  {
    label: "Invoice",
    icon: IconInvoice,
    children: [
      { label: "Invoice List", href: "/invoices" },
      { label: "Generate Invoice", href: "/invoices/new" },
    ],
  },
  {
    label: "Settings",
    icon: IconSettings,
    children: [
      { label: "Firm Settings", href: "/settings" },
      { label: "Locations", href: "/locations" },
      { label: "Holidays", href: "/holidays" },
    ],
  },
  { label: "Report Management", href: "/reports", icon: IconReport },
  {
    label: "Subadmin Management",
    icon: IconSubadmin,
    adminOnly: true,
    children: [
      { label: "Subadmin List", href: "/subadmins" },
      { label: "Add Subadmin", href: "/subadmins/new" },
    ],
  },
];
