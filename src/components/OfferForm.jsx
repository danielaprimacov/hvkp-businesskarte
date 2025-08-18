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
  };

  const TITLES = {
    general: "Ihre Anfrage",
    transport: "Angebot für Krantransport",
    montage: "Angebot für (De-)Montage",
    repair: "Angebot für Reparatur & Ersatzteile",
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

    // dimensions
    const dims = [
      "heightOfTheConstruction",
      "widthOfTheConstruction",
      "lengthOfTheConstruction",
    ];

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

    return e;
  };

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => onClose?.(), 3000); // close in 5s
    return () => clearTimeout(t); // cleanup if unmounted
  }, [success, onClose]);

  const handleSubmit = (event) => {
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
    // Here submit form
    setSuccess("Vielen Dank! Wir melden uns kurzfristig mit einem Festpreis.");
    setForm(initialState);
    setSubmitting(false);
  };

  const fieldClass = (hasErr) =>
    `peer block w-full h-12 bg-transparent border-b transition focus:outline-none ${
      hasErr
        ? "border-red-500 focus:border-red-600"
        : "border-b-black/20 focus:border-black"
    }`;

  // flags
  const isGeneral = variant === "general";
  const isTransport = variant === "transport";
  const isMontage = variant === "montage";
  const isRepair = variant === "repair";

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full mx-auto mt-4 space-y-4"
    >
      <h2 className="mb-5 text-2xl font-bold text-center tracking-widest">
        {TITLES[variant]}
      </h2>

      {success && <p className="text-green-600 text-center">{success}</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      <div className="grid grid-cols-2 gap-6">
        {/* Name */}
        <div className="relative mb-4">
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder=" "
            className={fieldClass(errors.name)} // includes 'peer'
          />
          <label
            htmlFor="name"
            className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
          >
            Name *
          </label>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder=" "
            className={fieldClass(errors.email)}
          />
          <label
            htmlFor="email"
            className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
          >
            Email *
          </label>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Phone (optional) */}
      <div className="relative mb-8">
        <input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder=" "
          className={fieldClass(false)}
        />
        <label
          htmlFor="phone"
          className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
        >
          Telefonnummer
        </label>
      </div>

      {/* Nachricht */}
      {!isRepair && (
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
            className="absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
          >
            Ihre Nachricht{isGeneral ? " *" : ""}
          </label>
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>
      )}

      {/* Repair: problem description instead of Nachricht */}
      {isRepair && (
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
            className="absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
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

      {(isTransport || isMontage || isRepair) && (
        <div className="grid grid-cols-3 gap-6">
          <div className="relative">
            <input
              id="craneModel"
              name="craneModel"
              value={form.craneModel}
              onChange={handleChange}
              required
              placeholder=" "
              className={fieldClass(errors.craneModel)}
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

      {isTransport && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <input
              id="pickupAddress"
              name="pickupAddress"
              value={form.pickupAddress}
              onChange={handleChange}
              required
              placeholder=" "
              className={fieldClass(errors.pickupAddress)}
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

      {isGeneral && (
        <>
          <div className="text-sm text-gray-600">
            <p>
              *Bitte tragen Sie die Abmessungen der <strong> Baustelle</strong>{" "}
              ein.
            </p>
          </div>

          {/* Dimensions: Höhe / Breite / Länge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Höhe */}
            <div className="relative mb-2">
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
                )} peer appearance-none`}
              />
              <label
                className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300
                      peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
              >
                Höhe (m) *
              </label>
              {errors.heightOfTheConstruction && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.heightOfTheConstruction}
                </p>
              )}
            </div>

            {/* Breite */}
            <div className="relative mb-2">
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
                )} peer appearance-none`}
              />
              <label
                className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300
                      peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
              >
                Breite (m) *
              </label>
              {errors.widthOfTheConstruction && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.widthOfTheConstruction}
                </p>
              )}
            </div>

            {/* Länge */}
            <div className="relative mb-2">
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
                )} peer appearance-none`}
              />
              <label
                className="mt-3 absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 
                          peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6"
              >
                Länge (m) *
              </label>
              {errors.lengthOfTheConstruction && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lengthOfTheConstruction}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {isGeneral && (
        <>
          <label className="mt-2 inline-flex items-center gap-3 select-none">
            <input
              type="checkbox"
              name="carport"
              checked={!!form.carport}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 accent-blue-400"
            />
            <span className="text-sm text-gray-700">Carport / Garage</span>
          </label>

          {/* Nearby trees */}
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

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="px-4 py-2 cursor-pointer rounded border hover:bg-gray-100 transition duration-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white cursor-pointer py-2 px-4 rounded uppercase hover:bg-blue-600 transition duration-300"
        >
          {submitting ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}

export default OfferForm;
