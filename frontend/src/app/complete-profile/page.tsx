"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { api } from "@/lib/api";
import { HandlerProfile, ROLES, isFarmer, isOrganizationFarmer } from "@/lib/types";
import {
  isValidPhone,
  normalizePhoneForStorage,
  onCountryChangePhone,
} from "@/lib/phone";
import { PhoneInput } from "@/components/PhoneInput";
import { CustomProductInput } from "@/components/CustomProductInput";
import { QualificationSelector } from "@/components/QualificationSelector";
import { SMS_PHONE_VERIFICATION_ENABLED } from "@/lib/smsVerification";
import { PhoneVerificationChallenge } from "@/components/PhoneVerificationChallenge";
import { EmailText } from "@/components/EmailText";
import { Icon } from "@/components/icons";
import { PasswordInput } from "@/components/PasswordInput";
import { AuthHeroPanel } from "@/components/AuthHeroPanel";
import { useCancelRegistration } from "@/components/RegistrationTopBar";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PLATFORM_ACCOUNTANT_LABEL } from "@/lib/site";
import { floSelectOptionLabel } from "@/lib/handlerDisplayName";

const ALL_ROLES = [
  { group: "Fellow", id: ROLES.ORGANIZATION_FARMER, label: "Organization" },
  { group: "Research & Commerce", id: ROLES.RESEARCHER, label: "Researcher" },
  { group: "Research & Commerce", id: ROLES.BUYER, label: "Client" },
  { group: "Support & Operations", id: ROLES.FARMER_HANDLER, label: "Fellow Liaison Officer" },
  { group: "Support & Operations", id: ROLES.PLATFORM_ACCOUNTANT, label: PLATFORM_ACCOUNTANT_LABEL },
];

const ROLE_GROUPS = [
  { groupLabel: "Fellow", roles: ALL_ROLES.filter((r) => r.group === "Fellow") },
  { groupLabel: "Research & Commerce", roles: ALL_ROLES.filter((r) => r.group === "Research & Commerce") },
  { groupLabel: "Support & Operations", roles: ALL_ROLES.filter((r) => r.group === "Support & Operations") },
];

function buildCompletePayload(
  form: {
    phone: string;
    password: string;
    country: string;
    region: string;
    city: string;
    roleId: number;
    farmName: string;
    company: string;
    institution: string;
    expertise: string;
    qualifications: string[];
    handlerId: string;
  },
  customProducts: string[],
  isFarmerRole: boolean,
  needsHandler: boolean,
  hasGoogleAuth: boolean
) {
  const payload: Record<string, unknown> = {
    phone: normalizePhoneForStorage(form.phone, form.country),
    country: form.country.trim(),
    region: form.region.trim(),
    city: form.city.trim(),
    roleId: form.roleId,
  };
  if (!hasGoogleAuth && form.password.trim()) payload.password = form.password;
  if (needsHandler && form.handlerId.trim()) payload.handlerId = form.handlerId.trim();
  if (isFarmerRole) {
    if (customProducts.length > 0) payload.customProducts = customProducts;
    if (form.farmName.trim()) payload.farmName = form.farmName.trim();
  } else if (form.roleId === ROLES.BUYER && form.company.trim()) {
    payload.company = form.company.trim();
  } else if (form.roleId === ROLES.RESEARCHER) {
    if (form.institution.trim()) payload.institution = form.institution.trim();
    if (form.expertise.trim()) payload.expertise = form.expertise.trim();
    if (form.qualifications.length > 0) payload.qualifications = form.qualifications;
  }
  return payload;
}

export default function CompleteProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const cancelRegistration = useCancelRegistration();
  const router = useRouter();
  const formColumnRef = useRef<HTMLDivElement>(null);
  const skipInitialStepScrollRef = useRef(true);

  const [step, setStep] = useState(0);
  const [customProducts, setCustomProducts] = useState<string[]>([]);
  const [farmerHandlers, setFarmerHandlers] = useState<HandlerProfile[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    password: "",
    country: "",
    region: "",
    city: "",
    roleId: ROLES.BUYER as number,
    farmName: "",
    company: "",
    institution: "",
    expertise: "",
    qualifications: [] as string[],
    handlerId: "",
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.profileComplete) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    api.auth.handlers("farmer").then(setFarmerHandlers).catch(() => {});
  }, []);

  useEffect(() => {
    if (skipInitialStepScrollRef.current) {
      skipInitialStepScrollRef.current = false;
      return;
    }
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      formColumnRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [step]);

  const isFarmerRole = isFarmer(form.roleId);
  const isBuyerRole = form.roleId === ROLES.BUYER;
  const isResearcherRole = form.roleId === ROLES.RESEARCHER;
  const needsHandler = isFarmerRole || isBuyerRole || isResearcherRole;
  const availableHandlers = needsHandler ? farmerHandlers : [];
  const needsPhoneStep = SMS_PHONE_VERIFICATION_ENABLED && !user?.phoneVerified;
  const ACCOUNT_STEP = 0;
  const PHONE_STEP = needsPhoneStep ? 1 : -1;
  const DETAILS_STEP = needsPhoneStep ? 2 : 1;
  const COMMODITIES_STEP = needsPhoneStep ? 3 : 2;
  const totalSteps = (isFarmerRole ? 4 : 3) - (needsPhoneStep ? 0 : 1);

  const handleCountryChange = (country: string) => {
    setForm((prev) => ({
      ...prev,
      country,
      phone: onCountryChangePhone(prev.phone, prev.country, country),
    }));
  };

  const hasGoogleAuth = Boolean(user?.hasGoogleAuth);

  const canContinueAccount =
    isValidPhone(form.phone, form.country) &&
    form.country.trim() &&
    (hasGoogleAuth || !form.password || form.password.length >= 8);

  const canContinueDetails =
    form.region.trim().length >= 2 &&
    form.city.trim().length >= 2 &&
    (!needsHandler || (form.handlerId.trim() && availableHandlers.length > 0));

  const finish = async () => {
    if (!isValidPhone(form.phone, form.country)) {
      setError("Enter a valid mobile number for your country.");
      setStep(ACCOUNT_STEP);
      return;
    }
    if (needsHandler && !form.handlerId) {
      setError("Please select a handler before finishing.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const result = await api.auth.completeProfile(
        buildCompletePayload(form, customProducts, isFarmerRole, needsHandler, hasGoogleAuth)
      );
      api.setTokens(result.accessToken, result.refreshToken);
      await refreshUser();
      router.push(
        isFarmerRole ? "/farm" : isResearcherRole ? "/researcher/publications" : "/dashboard"
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user || user.profileComplete) {
    return (
      <AuthHeroPanel className="flex-1" formWidth="wide" simple>
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
          Loading your profile...
        </div>
      </AuthHeroPanel>
    );
  }

  const displayStep = step;
  const stepNumber = displayStep + 1;
  const stepLabels = [
    "Account",
    ...(needsPhoneStep ? ["Phone"] : []),
    "Details",
    ...(isFarmerRole ? ["Commodities"] : []),
  ];

  return (
    <AuthHeroPanel ref={formColumnRef} className="flex-1" formWidth="wide" simple>
      <ScrollReveal trigger="mount" delay={120} duration={500} direction="fade-up">
        <div className="space-y-4">
          <header>
            <h1 className="text-lg font-bold text-brand-900">Complete account</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Step {stepNumber} of {totalSteps}: {stepLabels[displayStep]}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Signed in as {user.firstName} {user.lastName} ·{" "}
              <EmailText email={user.email} className="inline" />
            </p>
          </header>

          <div className="auth-step-indicator !mb-3">
            <div className="auth-step-track">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                <div
                  key={s}
                  className={`auth-step-bar ${stepNumber >= s ? "auth-step-bar-active" : ""}`}
                  aria-hidden
                />
              ))}
            </div>
            <div className="auth-step-labels">
              {stepLabels.map((label, index) => (
                <span
                  key={label}
                  className={displayStep >= index ? "auth-step-label-active" : undefined}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {error && (
            <div className="auth-error mb-5" role="alert">
              <Icon name="x" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

            {/* Email verification step removed */}

            {step === PHONE_STEP && needsPhoneStep && (
              <PhoneVerificationChallenge
                phone={normalizePhoneForStorage(form.phone, form.country) || form.phone}
                country={form.country}
                onVerified={async () => {
                  await refreshUser();
                  setStep(DETAILS_STEP);
                }}
              />
            )}

            {step === ACCOUNT_STEP && (
              <div className="auth-form">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="auth-field">
                    <label htmlFor="complete-first-name" className="auth-label">
                      First Name
                    </label>
                    <input
                      id="complete-first-name"
                      value={user.firstName}
                      readOnly
                      className="auth-input bg-brand-50/80"
                    />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="complete-last-name" className="auth-label">
                      Last Name
                    </label>
                    <input
                      id="complete-last-name"
                      value={user.lastName}
                      readOnly
                      className="auth-input bg-brand-50/80"
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label htmlFor="complete-email" className="auth-label">
                    Email
                  </label>
                  <input
                    id="complete-email"
                    value={user.email}
                    readOnly
                    className="auth-input bg-brand-50/80"
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="complete-phone" className="auth-label">
                    Phone
                  </label>
                  <PhoneInput
                    id="complete-phone"
                    required
                    value={form.phone}
                    country={form.country}
                    onChange={(phone) => setForm((prev) => ({ ...prev, phone }))}
                    onCountryChange={handleCountryChange}
                    hint="Choose your country, then enter the 9 digits after the code"
                  />
                </div>

                {!hasGoogleAuth && (
                  <div className="auth-field">
                    <label htmlFor="complete-password" className="auth-label">
                      Password
                    </label>
                    <PasswordInput
                      id="complete-password"
                      minLength={8}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Enter your password"
                    />
                    <p className="auth-hint">At least 8 characters</p>
                  </div>
                )}

                <div className="auth-field">
                  <label htmlFor="complete-role" className="auth-label">
                    Select Role
                  </label>
                  <select
                    id="complete-role"
                    value={form.roleId}
                    onChange={(e) => setForm({ ...form, roleId: Number(e.target.value), handlerId: "" })}
                    className="auth-input w-full"
                  >
                    {ROLE_GROUPS.map((group) => (
                      <optgroup key={group.groupLabel} label={group.groupLabel}>
                        {group.roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  disabled={!canContinueAccount}
                  onClick={() => {
                    setError("");
                    setStep(needsPhoneStep ? PHONE_STEP : DETAILS_STEP);
                  }}
                  className="btn-primary w-full py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            )}

            {step === DETAILS_STEP && (
              <div className="auth-form">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="auth-field">
                    <label htmlFor="complete-region" className="auth-label">Region / State</label>
                    <input id="complete-region" required value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="auth-input" />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="complete-city" className="auth-label">City</label>
                    <input id="complete-city" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="auth-input" />
                  </div>
                </div>

                {isFarmerRole && (
                  <div className="auth-field">
                    <label htmlFor="complete-farm-name" className="auth-label">
                      {isOrganizationFarmer(form.roleId) ? "Organization Name" : "Production name"}
                    </label>
                    <input
                      id="complete-farm-name"
                      value={form.farmName}
                      onChange={(e) => setForm({ ...form, farmName: e.target.value })}
                      className="auth-input"
                    />
                  </div>
                )}

                {form.roleId === ROLES.BUYER && (
                  <div className="auth-field">
                    <label className="auth-label">Company</label>
                    <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="auth-input" />
                  </div>
                )}

                {form.roleId === ROLES.RESEARCHER && (
                  <>
                    <div className="auth-field">
                      <label className="auth-label">Institution</label>
                      <input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} className="auth-input" />
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">Area of expertise</label>
                      <input value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} className="auth-input" />
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">
                        Qualifications <span className="text-gray-400">(optional)</span>
                      </label>
                      <QualificationSelector
                        idPrefix="complete"
                        value={form.qualifications}
                        onChange={(qualifications) => setForm({ ...form, qualifications })}
                      />
                    </div>
                  </>
                )}

                {needsHandler && (
                  <div className="auth-field">
                    <label htmlFor="complete-handler" className="auth-label">
                      Fellow Liaison Officer
                    </label>
                    {availableHandlers.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-brand-200 bg-brand-50/50 px-4 py-3 text-sm text-brand-700">
                        No fellow liaison officers registered yet.
                      </p>
                    ) : (
                      <select
                        id="complete-handler"
                        value={form.handlerId}
                        onChange={(e) => setForm({ ...form, handlerId: e.target.value })}
                        className="auth-input w-full min-w-0"
                        required
                      >
                        <option value="">Select a Fellow Liaison Officer</option>
                        {availableHandlers.map((handler) => (
                          <option key={handler.id} value={handler.id}>
                            {floSelectOptionLabel(handler)}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <div className="auth-nav">
                  <button type="button" onClick={() => setStep(needsPhoneStep ? PHONE_STEP : ACCOUNT_STEP)} className="btn-outline auth-nav-btn">Back</button>
                  <button
                    type="button"
                    disabled={submitting || !canContinueDetails}
                    onClick={() => (isFarmerRole ? setStep(COMMODITIES_STEP) : finish())}
                    className="btn-primary auth-nav-btn disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : isFarmerRole ? "Continue" : "Finish setup"}
                  </button>
                </div>
              </div>
            )}

            {step === COMMODITIES_STEP && isFarmerRole && (
              <div className="auth-form">
                <div className="auth-section">
                  <div className="flex items-start gap-3">
                    <Icon name="leaf" className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                    <div>
                      <h3 className="auth-section-title">Commodities</h3>
                      <p className="auth-hint mt-1">
                        Type the commodities you supply. Clients will see these on your profile.
                      </p>
                    </div>
                  </div>
                </div>

                <CustomProductInput
                  products={customProducts}
                  onChange={setCustomProducts}
                  idPrefix="complete-commodity"
                  label="Type Commodities"
                />

                <div className="auth-nav">
                  <button type="button" onClick={() => setStep(DETAILS_STEP)} className="btn-outline auth-nav-btn">Back</button>
                  <button
                    type="button"
                    disabled={
                      submitting ||
                      customProducts.length === 0 ||
                      !form.handlerId
                    }
                    onClick={finish}
                    className="btn-primary auth-nav-btn disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Finish setup"}
                  </button>
                </div>
              </div>
            )}
          <p className="auth-switch !mt-6 text-center">
            <button
              type="button"
              onClick={cancelRegistration}
              className="text-sm font-medium text-gray-500 hover:text-brand-700"
            >
              Cancel registration
            </button>
          </p>
        </div>
      </ScrollReveal>
    </AuthHeroPanel>
  );
}
