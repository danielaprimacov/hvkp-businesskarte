import { useState, useEffect } from "react";

function OfferForm({ onClose }) {
  const initialState = {
    name: "",
    email: "",
    phone: "",
    message: "",
    heightOfTheConstruction: "",
    widthOfTheConstruction: "",
    lengthOfTheConstruction: "",
    nearbyTrees: false,
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

    if (!f.heightOfTheConstruction || f.heightOfTheConstruction <= 0)
      e.heightOfTheConstruction = "Höhe muss größer als 0 sein.";
    if (!f.widthOfTheConstruction || f.widthOfTheConstruction <= 0)
      e.widthOfTheConstruction = "Breite muss größer als 0 sein.";
    if (!f.lengthOfTheConstruction || f.lengthOfTheConstruction <= 0)
      e.lengthOfTheConstruction = "Länge muss größer als 0 sein.";

    return e;
  };

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => onClose?.(), 5000); // close in 5s
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
    `peer block w-full h-10 bg-transparent border-b transition focus:outline-none ${
      hasErr
        ? "border-red-500 focus:border-red-600"
        : "border-b-black/20 focus:border-black"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full mx-auto mt-4 space-y-4"
    >
      <h2 className="mb-5 text-2xl font-bold text-center tracking-widest">
        Ihre Anfrage
      </h2>

      {success && <p className="text-green-600 text-center">{success}</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      <div className="grid grid-cols-2 gap-6">
        {/* Name */}
        <div className="relative mb-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder=" "
            className={fieldClass(errors.name)} // includes 'peer'
          />
          <label className="absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6">
            Name *
          </label>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder=" "
            className={fieldClass(errors.email)}
          />
          <label className="absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6">
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
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder=" "
          className={fieldClass(false)}
        />
        <label className="absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6">
          Telefonnummer
        </label>
      </div>

      {/* Nachricht */}
      <div className="relative mb-8">
        <textarea
          name="message"
          rows={3}
          value={form.message}
          onChange={handleChange}
          required
          placeholder=" "
          className={`${fieldClass(false)} resize-none overflow-auto`} // <- fixed height
        />
        <label className="absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-focus:-top-6">
          Ihre Nachricht
        </label>
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
            className="absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300
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
            className="absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300
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
            className="absolute left-0 -top-6 text-sm text-gray-500 transition-all duration-300 
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

      {/* Nearby trees */}
      <label className="mt-2 inline-flex items-center gap-3 select-none">
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

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="px-4 py-2 cursor-pointer rounded border hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white cursor-pointer py-2 px-4 rounded uppercase hover:bg-blue-600 transition"
        >
          {submitting ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}

export default OfferForm;
