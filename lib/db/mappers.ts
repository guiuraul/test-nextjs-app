import { type ClaimRecordInsert } from "@/lib/db/schema";
import { type InsuranceClaimImportInput } from "@/lib/csv/insurance-claims";

function toNullableBooleanFlag(value: string) {
  const normalized = value.trim().toUpperCase();
  if (normalized === "YES" || normalized === "Y" || normalized === "TRUE") {
    return true;
  }
  if (normalized === "NO" || normalized === "N" || normalized === "FALSE") {
    return false;
  }
  return false;
}

function toDate(value: string) {
  return value.trim();
}

export function mapInsuranceClaimToInsert(
  row: InsuranceClaimImportInput,
  userId: string,
  importId: string
): ClaimRecordInsert {
  return {
    userId,
    importId,
    monthsAsCustomer: row.months_as_customer,
    age: row.age,
    policyNumber: row.policy_number,
    policyBindDate: toDate(row.policy_bind_date),
    policyState: row.policy_state,
    policyCsl: row.policy_csl,
    policyDeductable: row.policy_deductable,
    policyAnnualPremium: row.policy_annual_premium.toString(),
    umbrellaLimit: row.umbrella_limit,
    insuredZip: row.insured_zip,
    insuredSex: row.insured_sex as "MALE" | "FEMALE",
    insuredEducationLevel: row.insured_education_level,
    insuredOccupation: row.insured_occupation,
    insuredHobbies: row.insured_hobbies,
    insuredRelationship: row.insured_relationship,
    capitalGains: row["capital-gains"],
    capitalLoss: row["capital-loss"],
    incidentDate: toDate(row.incident_date),
    incidentType: row.incident_type,
    collisionType: row.collision_type,
    incidentSeverity: row.incident_severity,
    authoritiesContacted: row.authorities_contacted,
    incidentState: row.incident_state,
    incidentCity: row.incident_city,
    incidentLocation: row.incident_location,
    incidentHourOfTheDay: row.incident_hour_of_the_day,
    numberOfVehiclesInvolved: row.number_of_vehicles_involved,
    propertyDamage: row.property_damage,
    bodilyInjuries: row.bodily_injuries,
    witnesses: row.witnesses,
    policeReportAvailable: row.police_report_available,
    totalClaimAmount: row.total_claim_amount.toString(),
    injuryClaim: row.injury_claim.toString(),
    propertyClaim: row.property_claim.toString(),
    vehicleClaim: row.vehicle_claim.toString(),
    autoMake: row.auto_make,
    autoModel: row.auto_model,
    autoYear: row.auto_year,
    fraudReported: toNullableBooleanFlag(row.fraud_reported),
    _c39: row._c39 === "Y",
  };
}
