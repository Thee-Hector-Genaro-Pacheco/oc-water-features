"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Users, Search, Phone, Mail, MapPin, ChevronRight, Briefcase } from "lucide-react";

export interface CustomerRecord {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  city: string;
  service_address?: string;
  customer_status: string;
  created_at: string;
  jobs?: { id: string }[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("customers")
      .select("*, jobs(id)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCustomers(data as CustomerRecord[]);
    }
    setLoading(false);
  };

  const filteredCustomers = customers.filter((cust) => {
    return (
      cust.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cust.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Customer Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Converted clients, service addresses, and historic job contracts.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" aria-hidden="true" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers by name, phone, email, or city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600"
          />
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Loading customer directory...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No Customers Recorded</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Convert won leads in the Lead Management section to build your client directory.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Customer Name</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">City / Address</th>
                  <th className="py-3.5 px-4">Total Jobs</th>
                  <th className="py-3.5 px-4">Client Since</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <Link href={`/admin/customers/${cust.id}`} className="group">
                        <span className="font-bold text-slate-900 group-hover:text-brand-600 block">
                          {cust.full_name}
                        </span>
                        <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">
                          {cust.customer_status}
                        </span>
                      </Link>
                    </td>

                    <td className="py-4 px-4 text-xs space-y-0.5 text-slate-600">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{cust.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{cust.email}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-700">
                      <div className="flex items-center gap-1 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-brand-600" />
                        <span>{cust.city}</span>
                      </div>
                      {cust.service_address && (
                        <p className="text-slate-500 mt-0.5">{cust.service_address}</p>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded bg-brand-50 text-brand-700 border border-brand-100">
                        <Briefcase className="w-3 h-3" />
                        <span>{cust.jobs?.length || 0} Jobs</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-500">
                      {new Date(cust.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/customers/${cust.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline"
                      >
                        <span>Manage Client</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
