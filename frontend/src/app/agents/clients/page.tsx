"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { api } from "@/lib/api";
import { AgentAssignment, isBuyerAssignment, isBuyerHandler, isHandler } from "@/lib/types";
import { HandlerBuyerClientCard } from "@/components/HandlerAssignmentCards";
import { PageContentSkeleton } from "@/components/LoadingPrimitives";

export default function AssignedClientsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState<AgentAssignment[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (!isHandler(user.roleId)) {
      router.push("/dashboard");
      return;
    }
    if (!isBuyerHandler(user.roleId)) {
      router.replace("/agents/fellows");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !isBuyerHandler(user.roleId)) return;

    let cancelled = false;
    api.agents
      .assignments()
      .then((list) => {
        if (!cancelled) {
          setAssignments(list.filter(isBuyerAssignment));
          setError("");
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setAssignments([]);
          setError(e instanceof Error ? e.message : "Failed to load assigned clients");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading || !user) {
    return <PageContentSkeleton maxWidth="max-w-6xl" />;
  }

  const clients = assignments ?? [];
  const loadingList = assignments === null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
      >
        Back to dashboard
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-900">Assigned Clients</h1>
        <p className="mt-1 text-sm text-gray-500">
          Clients who assigned you as their liaison officer. View their profiles and order activity.
        </p>
      </div>

      {error && (
        <p className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
      )}

      {loadingList ? (
        <PageContentSkeleton maxWidth="max-w-6xl" />
      ) : clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/30 p-10 text-center">
          <p className="text-3xl">👥</p>
          <p className="mt-2 font-semibold text-brand-900">No clients assigned yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Clients choose you as their liaison officer when they register on the platform.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-xs text-gray-500">
            {clients.length} client{clients.length !== 1 ? "s" : ""} assigned
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((assignment) => (
              <HandlerBuyerClientCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
