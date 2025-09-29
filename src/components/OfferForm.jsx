import { useState, useEffect } from "react";

function OfferForm({ onClose, variant = "general" }) {
  const currentYear = new Date().getFullYear();

  const initialState = {
    name: "",
    email: "",
    phone: "",
    message: "",
    // general
    heightOfTheConstruction: "",
    widthOfTheConstruction: "",
    lengthOfTheConstruction: "",
    nearbyTrees: false,
    carport: false,
    // transport- / montage-specific
    pickupAddress: "",
    destinationAddress: "",
    // montage / repair / transport
    craneModel: "",
    craneManufacturers: "",
    constructionYear: "",
    siteAddress: "", // montage / repair
    // pruefung
    inspectionType: "", // "wiederkehrend" | "ausserordentlich" | "abnahme"
    lastInspectionDate: "", // yyyy-mm-dd
    preferredDateWindow: "", // free text
  };

  const TITLES = {
    general: "Ihre Anfrage",
    transport: "Angebot für Krantransport",
    montage: "Angebot für (De-)Montage",
    repair: "Angebot für Reparatur & Ersatzteile",
    pruefung: "Angebot für Wiederkehrende Prüfung",
  };

  const [form, setForm] = useState(initialState);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({}); // field-level errors

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // converting the inputs to numbers and checkboxes to booleans
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const validate = (f) => {
    const e = {};
    if (!f.name.trim()) e.name = "Bitte geben Sie Ihren Namen ein.";
    if (!f.email.trim()) e.email = "Bitte geben Sie Ihre E-Mail ein.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
      e.email = "Bitte geben Sie eine gültige E-Mail ein.";

    // dimensions: for general (required)
    if (variant === "general") {
      if (!f.heightOfTheConstruction || f.heightOfTheConstruction <= 0)
        e.heightOfTheConstruction = "Höhe muss größer als 0 sein.";
      if (!f.widthOfTheConstruction || f.widthOfTheConstruction <= 0)
        e.widthOfTheConstruction = "Breite muss größer als 0 sein.";
      if (!f.lengthOfTheConstruction || f.lengthOfTheConstruction <= 0)
        e.lengthOfTheConstruction = "Länge muss größer als 0 sein.";
    }

    const checkYear = () => {
      const y = Number(f.constructionYear);
      if (!y || !Number.isInteger(y) || y < 1950 || y > currentYear + 1)
        return (
          "Bitte geben Sie ein gültiges Baujahr an (z. B. " + currentYear + ")."
        );
      return null;
    };

    // transport fields
    if (variant === "transport") {
      if (!f.craneModel.trim()) e.craneModel = "Kranmodell/Typ erforderlich.";
      if (!f.craneManufacturers.trim())
        e.craneManufacturers = "Kranhersteller erforderlich.";
      const yErr = checkYear();
      if (yErr) e.constructionYear = yErr;

      if (!f.pickupAddress.trim())
        e.pickupAddress = "Abholadresse erforderlich.";
      if (!f.destinationAddress.trim())
        e.destinationAddress = "Zieladresse erforderlich.";
    }

    // montage fields
    if (variant === "montage") {
      if (!f.craneModel.trim()) e.craneModel = "Kranmodell/Typ erforderlich.";
      if (!f.craneManufacturers.trim())
        e.craneManufacturers = "Kranhersteller erforderlich.";
      const yErr = checkYear();
      if (yErr) e.constructionYear = yErr;

      if (!f.siteAddress.trim())
        e.siteAddress = "Baustellenadresse erforderlich.";
    }

    // repair fields
    if (variant === "repair") {
      if (!f.craneModel.trim()) e.craneModel = "Kranmodell/Typ erforderlich.";
      if (!f.craneManufacturers.trim())
        e.craneManufacturers = "Kranhersteller erforderlich.";
      if (!f.siteAddress.trim())
        e.siteAddress = "Standortadresse erforderlich.";
      if (!f.problemDescription?.trim())
        e.problemDescription = "Bitte schildern Sie das Problem.";
    }

    // pruefung
    if (variant === "pruefung") {
      if (!f.craneModel.trim()) e.craneModel = "Kranmodell/Typ erforderlich.";
      if (!f.craneManufacturers.trim())
        e.craneManufacturers = "Kranhersteller erforderlich.";
      const yErr = checkYear();
      if (yErr) e.constructionYear = yErr;
      if (!f.siteAddress.trim())
        e.siteAddress = "Standortadresse erforderlich.";
      if (!f.inspectionType) e.inspectionType = "Bitte Prüfungsart auswählen.";
      // dates/notes are optional
    }

    return e;
  };

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => onClose?.(), 3000); // close in 3s
    return () => clearTimeout(t); // cleanup if unmounted
  }, [success, onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");

    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) {
      setError("Bitte korrigieren Sie die markierten Felder.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/send-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, variant }),
      });
      if (!res.ok) throw new Error(await res.text());

      setSuccess(
        "Vielen Dank! Wir melden uns kurzfristig mit einem Festpreis."
      );
      setForm(initialState);
    } catch (e) {
      console.error(e);
      setError("Senden fehlgeschlagen. Bitte versuchen Sie es erneut.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (hasErr) =>
    `peer block w-full h-12 bg-transparent border-b text-base
     focus:outline-none focus:ring-0
     transition
     ${
       hasErr
         ? "border-red-500 focus:border-red-600"
         : "border-b-black/20 focus:border-black"
     }`;

  // flags
  const isGeneral = variant === "general";
  const isTransport = variant === "transport";
  const isMontage = variant === "montage";
  const isRepair = variant === "repair";
  const isPruefung = variant === "pruefung";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full mx-auto mt-2 sm:mt-4 space-y-3 sm:space-y-4"
    >
      <h2 className="mb-2 sm:mb-5 text-xl sm:text-2xl font-bold text-center tracking-widest">
        {TITLES[variant]}
      </h2>

      {success && <p className="text-green-600 text-center">{success}</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {/* Name / Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="relative">
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder=" "
            aria-invalid={!!errors.name}
            className={fieldClass(errors.name)}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <label
            htmlFor="name"
            className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300
                       peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
          >
            Name *
          </label>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder=" "
            aria-invalid={!!errors.email}
            className={fieldClass(errors.email)}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <label
            htmlFor="email"
            className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300
                       peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
          >
            Email *
          </label>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div className="relative">
        <input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder=" "
          className={fieldClass(false)}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <label
          htmlFor="phone"
          className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300
                     peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
        >
          Telefonnummer
        </label>
      </div>

      {/* Nachricht / Problembeschreibung */}
      {!isRepair ? (
        <div className="relative">
          <textarea
            id="message"
            name="message"
            rows={3}
            value={form.message}
            onChange={handleChange}
            required={isGeneral}
            placeholder=" "
            className={`${fieldClass(
              errors.message
            )} resize-none overflow-auto`}
          />
          <label
            htmlFor="message"
            className="mt-2 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300
                       peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
          >
            Ihre Nachricht{isGeneral ? " *" : ""}
          </label>
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>
      ) : (
        <div className="relative">
          <textarea
            id="problemDescription"
            name="problemDescription"
            rows={3}
            value={form.problemDescription || ""}
            onChange={handleChange}
            required
            placeholder=" "
            className={`${fieldClass(
              errors.problemDescription
            )} resize-none overflow-auto`}
          />
          <label
            htmlFor="problemDescription"
            className="mt-2 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300
                       peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
          >
            Problembeschreibung *
          </label>
          {errors.problemDescription && (
            <p className="mt-1 text-sm text-red-600">
              {errors.problemDescription}
            </p>
          )}
        </div>
      )}

      {(isTransport || isMontage || isRepair || isPruefung) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="relative">
            <input
              id="craneModel"
              name="craneModel"
              value={form.craneModel}
              onChange={handleChange}
              required
              placeholder=" "
              className={fieldClass(errors.craneModel)}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <label
              htmlFor="craneModel"
              className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
            >
              Kranmodell/Typ *
            </label>
            {errors.craneModel && (
              <p className="mt-1 text-sm text-red-600">{errors.craneModel}</p>
            )}
          </div>

          <div className="relative">
            <input
              id="craneManufacturers"
              name="craneManufacturers"
              value={form.craneManufacturers}
              onChange={handleChange}
              required
              placeholder=" "
              className={fieldClass(errors.craneManufacturers)}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <label
              htmlFor="craneManufacturers"
              className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
            >
              Kranhersteller *
            </label>
            {errors.craneManufacturers && (
              <p className="mt-1 text-sm text-red-600">
                {errors.craneManufacturers}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              id="constructionYear"
              name="constructionYear"
              type="number"
              inputMode="numeric"
              min="1950"
              max={currentYear + 1}
              step="1"
              value={form.constructionYear}
              onChange={handleChange}
              required
              placeholder=" "
              className={`${fieldClass(
                errors.constructionYear
              )} appearance-none`}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <label
              htmlFor="constructionYear"
              className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
            >
              Baujahr *
            </label>
            {errors.constructionYear && (
              <p className="mt-1 text-sm text-red-600">
                {errors.constructionYear}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Transport-only addresses */}
      {isTransport && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative">
            <input
              id="pickupAddress"
              name="pickupAddress"
              value={form.pickupAddress}
              onChange={handleChange}
              required
              placeholder=" "
              className={fieldClass(errors.pickupAddress)}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <label
              htmlFor="pickupAddress"
              className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
            >
              Abholadresse *
            </label>
            {errors.pickupAddress && (
              <p className="mt-1 text-sm text-red-600">
                {errors.pickupAddress}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              id="destinationAddress"
              name="destinationAddress"
              value={form.destinationAddress}
              onChange={handleChange}
              required
              placeholder=" "
              className={fieldClass(errors.destinationAddress)}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <label
              htmlFor="destinationAddress"
              className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
            >
              Zieladresse *
            </label>
            {errors.destinationAddress && (
              <p className="mt-1 text-sm text-red-600">
                {errors.destinationAddress}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Montage / Repair require a site address */}
      {(isMontage || isRepair) && (
        <div className="relative">
          <input
            id="siteAddress"
            name="siteAddress"
            value={form.siteAddress}
            onChange={handleChange}
            required
            placeholder=" "
            className={fieldClass(errors.siteAddress)}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <label
            htmlFor="siteAddress"
            className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
          >
            Baustellenadresse *
          </label>
          {errors.siteAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.siteAddress}</p>
          )}
        </div>
      )}

      {/* --- NEW: Prüfung fields --- */}
      {isPruefung && (
        <>
          <div className="relative">
            <input
              id="siteAddress"
              name="siteAddress"
              value={form.siteAddress}
              onChange={handleChange}
              required
              placeholder=" "
              className={fieldClass(errors.siteAddress)}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <label
              htmlFor="siteAddress"
              className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
            >
              Standortadresse *
            </label>
            {errors.siteAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.siteAddress}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="relative">
              <select
                id="inspectionType"
                name="inspectionType"
                value={form.inspectionType || ""}
                onChange={handleChange}
                required
                aria-invalid={!form.inspectionType}
                className={[
                  "block w-full h-12 bg-transparent border-b text-base focus:outline-none focus:ring-0 transition",
                  errors.inspectionType
                    ? "border-red-500 focus:border-red-600"
                    : "border-b-black/20 focus:border-black",
                  !form.inspectionType ? "text-gray-500" : "text-black",
                ].join(" ")}
              >
                <option value="" disabled>
                  Bitte wählen…
                </option>
                <option value="wiederkehrend">Wiederkehrend</option>
                <option value="ausserordentlich">Außerordentlich</option>
                <option value="abnahme">Abnahme</option>
              </select>
              <label
                htmlFor="inspectionType"
                className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
              >
                Prüfungsart *
              </label>
              {errors.inspectionType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.inspectionType}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                id="lastInspectionDate"
                name="lastInspectionDate"
                type="date"
                value={form.lastInspectionDate}
                onChange={handleChange}
                placeholder=" "
                className={fieldClass(false)}
              />
              <label
                htmlFor="lastInspectionDate"
                className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
              >
                Letzte Prüfung (optional)
              </label>
            </div>

            <div className="relative">
              <input
                id="preferredDateWindow"
                name="preferredDateWindow"
                value={form.preferredDateWindow}
                onChange={handleChange}
                placeholder=" "
                className={fieldClass(false)}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <label
                htmlFor="preferredDateWindow"
                className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
              >
                Wunschtermin / Zeitfenster
              </label>
            </div>
          </div>

          <label className="inline-flex items-center gap-3 select-none">
            <input
              type="checkbox"
              name="lastReportAvailable"
              checked={!!form.lastReportAvailable}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 accent-blue-400"
            />
            <span className="text-sm text-gray-700">
              Letzter Prüfbericht vorhanden
            </span>
          </label>
        </>
      )}

      {/* General-only dimension fields */}
      {isGeneral && (
        <>
          <div className="text-sm text-gray-600">
            <p>
              *Bitte tragen Sie die Abmessungen der <strong>Baustelle</strong>{" "}
              ein.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="relative">
              <input
                name="heightOfTheConstruction"
                type="number"
                min="0.01"
                step="0.01"
                value={form.heightOfTheConstruction}
                onChange={handleChange}
                required
                placeholder=" "
                inputMode="decimal"
                className={`${fieldClass(
                  errors.heightOfTheConstruction
                )} appearance-none`}
              />
              <label className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6">
                Höhe (m) *
              </label>
              {errors.heightOfTheConstruction && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.heightOfTheConstruction}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                name="widthOfTheConstruction"
                type="number"
                min="0.01"
                step="0.01"
                value={form.widthOfTheConstruction}
                onChange={handleChange}
                required
                placeholder=" "
                inputMode="decimal"
                className={`${fieldClass(
                  errors.widthOfTheConstruction
                )} appearance-none`}
              />
              <label className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6">
                Breite (m) *
              </label>
              {errors.widthOfTheConstruction && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.widthOfTheConstruction}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                name="lengthOfTheConstruction"
                type="number"
                min="0.01"
                step="0.01"
                value={form.lengthOfTheConstruction}
                onChange={handleChange}
                required
                placeholder=" "
                inputMode="decimal"
                className={`${fieldClass(
                  errors.lengthOfTheConstruction
                )} appearance-none`}
              />
              <label className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6">
                Länge (m) *
              </label>
              {errors.lengthOfTheConstruction && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lengthOfTheConstruction}
                </p>
              )}
            </div>
          </div>

          <label className="mt-1 inline-flex items-center gap-3 select-none">
            <input
              type="checkbox"
              name="carport"
              checked={!!form.carport}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 accent-blue-400"
            />
            <span className="text-sm text-gray-700">Carport / Garage</span>
          </label>

          <label className="inline-flex items-center gap-3 select-none">
            <input
              type="checkbox"
              name="nearbyTrees"
              checked={!!form.nearbyTrees}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 accent-blue-400"
            />
            <span className="text-sm text-gray-700">
              Bäume in der Nähe (mögliche Einschränkungen)
            </span>
          </label>
        </>
      )}

      {/* Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-2 sm:pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="w-full sm:w-auto px-4 py-3 sm:py-2 cursor-pointer rounded border hover:bg-gray-100 transition duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto bg-black text-white cursor-pointer py-3 sm:py-2 px-4 rounded uppercase hover:bg-blue-600 transition duration-300"
        >
          {submitting ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}

export default OfferForm;
