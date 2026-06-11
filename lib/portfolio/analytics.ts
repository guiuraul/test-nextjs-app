import "server-only";

import { and, eq, lte, sql } from "drizzle-orm";

import { withUserContext } from "@/lib/db";
import { claimRecords, type ClaimRecordSelect } from "@/lib/db/schema";

export type PortfolioFilterDefinition = {
  policyState?: string | null;
  insuredSex?: string | null;
  incidentState?: string | null;
  autoMake?: string | null;
  incidentYear?: number | null;
  maxTotalClaimAmount?: number | null;
};

export type PortfolioAnalyticsSeriesItem = {
  label: string;
  value: number;
};

export type PortfolioAnalytics = {
  totalClaims: number;
  totalClaimAmount: number;
  averageClaimAmount: number;
  totalInjuryClaim: number;
  totalPropertyClaim: number;
  totalVehicleClaim: number;
  yearlyTotals: PortfolioAnalyticsSeriesItem[];
  makeBreakdown: PortfolioAnalyticsSeriesItem[];
  stateBreakdown: PortfolioAnalyticsSeriesItem[];
  genderBreakdown: PortfolioAnalyticsSeriesItem[];
  recentClaims: Array<Pick<ClaimRecordSelect, "incidentDate" | "autoMake" | "incidentCity" | "totalClaimAmount">>;
};

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseIncidentYear(value: string | Date) {
  const dateValue = value instanceof Date ? value : new Date(value);
  return Number.isNaN(dateValue.getTime()) ? null : dateValue.getFullYear();
}

function buildBreakdown(rows: Array<Record<string, unknown>>, field: string) {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const raw = row[field];
    const label = raw ? String(raw) : "Unknown";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 6);
}

function buildYearlyTotals(rows: Array<Record<string, unknown>>) {
  const grouped = new Map<
    string,
    {
      label: string;
      value: number;
    }
  >();

  for (const row of rows) {
    const year = parseIncidentYear(row.incidentDate as string | Date);
    if (!year) {
      continue;
    }

    const current = grouped.get(String(year)) ?? { label: String(year), value: 0 };
    current.value += toNumber(row.totalClaimAmount as string | number);
    grouped.set(String(year), current);
  }

  return Array.from(grouped.values()).sort((left, right) => Number(left.label) - Number(right.label));
}

export async function getPortfolioAnalytics(
  userId: string,
  filters: PortfolioFilterDefinition
): Promise<PortfolioAnalytics> {
  return withUserContext(userId, async (tx) => {
    const conditions = [eq(claimRecords.userId, userId)];

    if (filters.policyState) {
      conditions.push(eq(claimRecords.policyState, filters.policyState));
    }

    if (filters.insuredSex) {
      conditions.push(eq(claimRecords.insuredSex, filters.insuredSex as "MALE" | "FEMALE"));
    }

    if (filters.incidentState) {
      conditions.push(eq(claimRecords.incidentState, filters.incidentState));
    }

    if (filters.autoMake) {
      conditions.push(eq(claimRecords.autoMake, filters.autoMake));
    }

    if (filters.incidentYear) {
      conditions.push(sql<boolean>`extract(year from ${claimRecords.incidentDate}) = ${filters.incidentYear}`);
    }

    if (filters.maxTotalClaimAmount !== null && filters.maxTotalClaimAmount !== undefined) {
      conditions.push(lte(claimRecords.totalClaimAmount, String(filters.maxTotalClaimAmount)));
    }

    const rows = await tx
      .select({
        incidentDate: claimRecords.incidentDate,
        totalClaimAmount: claimRecords.totalClaimAmount,
        injuryClaim: claimRecords.injuryClaim,
        propertyClaim: claimRecords.propertyClaim,
        vehicleClaim: claimRecords.vehicleClaim,
        autoMake: claimRecords.autoMake,
        incidentState: claimRecords.incidentState,
        insuredSex: claimRecords.insuredSex,
        incidentCity: claimRecords.incidentCity,
      })
      .from(claimRecords)
      .where(and(...conditions));

    const totalClaimAmount = rows.reduce((sum, row) => sum + toNumber(row.totalClaimAmount), 0);
    const totalInjuryClaim = rows.reduce((sum, row) => sum + toNumber(row.injuryClaim), 0);
    const totalPropertyClaim = rows.reduce((sum, row) => sum + toNumber(row.propertyClaim), 0);
    const totalVehicleClaim = rows.reduce((sum, row) => sum + toNumber(row.vehicleClaim), 0);

    return {
      totalClaims: rows.length,
      totalClaimAmount,
      averageClaimAmount: rows.length > 0 ? totalClaimAmount / rows.length : 0,
      totalInjuryClaim,
      totalPropertyClaim,
      totalVehicleClaim,
      yearlyTotals: buildYearlyTotals(rows),
      makeBreakdown: buildBreakdown(rows as Array<Record<string, unknown>>, "autoMake"),
      stateBreakdown: buildBreakdown(rows as Array<Record<string, unknown>>, "incidentState"),
      genderBreakdown: buildBreakdown(rows as Array<Record<string, unknown>>, "insuredSex"),
      recentClaims: rows
        .slice()
        .sort((left, right) => new Date(String(right.incidentDate)).getTime() - new Date(String(left.incidentDate)).getTime())
        .slice(0, 5)
        .map((row) => ({
          incidentDate: row.incidentDate,
          autoMake: row.autoMake,
          incidentCity: row.incidentCity,
          totalClaimAmount: row.totalClaimAmount,
        })),
    };
  });
}

