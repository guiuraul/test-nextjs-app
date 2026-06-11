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

export const insuranceClaimCsvHeaders: Array<keyof InsuranceClaimCsvRow> = [
  "months_as_customer",
  "age",
  "policy_number",
  "policy_bind_date",
  "policy_state",
  "policy_csl",
  "policy_deductable",
  "policy_annual_premium",
  "umbrella_limit",
  "insured_zip",
  "insured_sex",
  "insured_education_level",
  "insured_occupation",
  "insured_hobbies",
  "insured_relationship",
  "capital-gains",
  "capital-loss",
  "incident_date",
  "incident_type",
  "collision_type",
  "incident_severity",
  "authorities_contacted",
  "incident_state",
  "incident_city",
  "incident_location",
  "incident_hour_of_the_day",
  "number_of_vehicles_involved",
  "property_damage",
  "bodily_injuries",
  "witnesses",
  "police_report_available",
  "total_claim_amount",
  "injury_claim",
  "property_claim",
  "vehicle_claim",
  "auto_make",
  "auto_model",
  "auto_year",
  "fraud_reported",
  "_c39",
];

export class InsuranceClaimsCsvValidationError extends Error {
  details: string[];

  constructor(message: string, details: string[]) {
    super(message);
    this.name = "InsuranceClaimsCsvValidationError";
    this.details = details;
  }
}

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

function normalizeHeader(header: string) {
  return header.trim();
}

function validateInsuranceClaimsHeaders(headers: string[]) {
  const normalizedHeaders = headers.map(normalizeHeader);
  const expectedHeaders = insuranceClaimCsvHeaders;
  const foundSet = new Set<string>(normalizedHeaders);
  const expectedSet = new Set<string>(expectedHeaders);

  const duplicates = normalizedHeaders.filter(
    (header, index) => normalizedHeaders.indexOf(header) !== index
  );
  const missing = expectedHeaders.filter((header) => !foundSet.has(header));
  const unexpected = normalizedHeaders.filter((header) => !expectedSet.has(header));

  if (duplicates.length === 0 && missing.length === 0 && unexpected.length === 0) {
    return;
  }

  const details = [
    `Expected ${expectedHeaders.length} columns from insurance_claims.csv.`,
    missing.length > 0 ? `Missing columns: ${missing.join(", ")}` : null,
    unexpected.length > 0 ? `Unexpected columns: ${unexpected.join(", ")}` : null,
    duplicates.length > 0 ? `Duplicate columns: ${Array.from(new Set(duplicates)).join(", ")}` : null,
    "Download the CSV template from the import page and make sure the headers match exactly.",
  ].filter((line): line is string => Boolean(line));

  throw new InsuranceClaimsCsvValidationError(
    "The uploaded CSV does not match the expected insurance_claims.csv format.",
    details
  );
}

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

  const headers = splitCsvLine(lines[0]).map(normalizeHeader) as Array<
    keyof InsuranceClaimCsvRow
  >;
  validateInsuranceClaimsHeaders(headers);

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

