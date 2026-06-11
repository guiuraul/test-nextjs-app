import { evaluateGroup39 } from "@/lib/data/insurance-group-39";

export type InsuranceClaimCsvRow = {
  months_as_customer: number;
  age: number;
  policy_number: number;
  policy_bind_date: string;
  policy_state: string;
  policy_csl: string;
  policy_deductable: number;
  policy_annual_premium: number;
  umbrella_limit: number;
  insured_zip: number;
  insured_sex: string;
  insured_education_level: string;
  insured_occupation: string;
  insured_hobbies: string;
  insured_relationship: string;
  "capital-gains": number;
  "capital-loss": number;
  incident_date: string;
  incident_type: string;
  collision_type: string;
  incident_severity: string;
  authorities_contacted: string;
  incident_state: string;
  incident_city: string;
  incident_location: string;
  incident_hour_of_the_day: number;
  number_of_vehicles_involved: number;
  property_damage: string;
  bodily_injuries: number;
  witnesses: number;
  police_report_available: string;
  total_claim_amount: number;
  injury_claim: number;
  property_claim: number;
  vehicle_claim: number;
  auto_make: string;
  auto_model: string;
  auto_year: number;
  fraud_reported: string;
  _c39?: string;
};

export type ParsedInsuranceClaimRow = InsuranceClaimCsvRow & {
  _c39: "Y" | "N";
};

export type InsuranceClaimImportInput = ParsedInsuranceClaimRow & {
  fraud_reported: "Y" | "N";
};

const numericColumns = new Set<keyof InsuranceClaimCsvRow>([
  "months_as_customer",
  "age",
  "policy_number",
  "policy_deductable",
  "policy_annual_premium",
  "umbrella_limit",
  "insured_zip",
  "capital-gains",
  "capital-loss",
  "incident_hour_of_the_day",
  "number_of_vehicles_involved",
  "bodily_injuries",
  "witnesses",
  "total_claim_amount",
  "injury_claim",
  "property_claim",
  "vehicle_claim",
  "auto_year",
]);

function parseValue(header: keyof InsuranceClaimCsvRow, raw: string) {
  const value = raw.trim();

  if (numericColumns.has(header)) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return value;
}

function splitCsvLine(line: string) {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

export function parseInsuranceClaimsCsv(csvText: string): ParsedInsuranceClaimRow[] {
  const lines = csvText
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const headers = splitCsvLine(lines[0]) as (keyof InsuranceClaimCsvRow)[];

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row = Object.fromEntries(
      headers.map((header, index) => [header, parseValue(header, values[index] ?? "")])
    ) as InsuranceClaimCsvRow;

    const group39 = evaluateGroup39(row.auto_make, row.auto_model);

    return {
      ...row,
      _c39: group39.isGroup39 ? "Y" : "N",
    };
  });
}

export function toInsuranceClaimImportInput(
  row: ParsedInsuranceClaimRow
): InsuranceClaimImportInput {
  return {
    ...row,
    fraud_reported: row.fraud_reported?.toUpperCase() === "Y" ? "Y" : "N",
  };
}

