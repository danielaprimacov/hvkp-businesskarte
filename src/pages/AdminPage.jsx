import { useContent } from "../content/content";
import { useAuth } from "../content/auth";
import { Link } from "react-router-dom";

export default function AdminPage() {
  const { content, update, reset } = useContent();
  const { logout } = useAuth();

  const bind = (key) => (e) => update({ [key]: e.target.value });

  return (
    <div className="bg-blue-200 min-h-screen">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin: Texte</h1>
          <div className="text-sm flex gap-5 underline">
            <button onClick={logout} className="cursor-pointer">
              Logout
            </button>
            <Link to="/">Zurück</Link>
          </div>
        </div>

        <label className="block mb-2 text-sm">Hero Title</label>
        <input
          className="w-full border p-2 rounded mb-4"
          value={content.heroTitle}
          onChange={bind("heroTitle")}
        />

        <label className="block mb-2 text-sm">Hero Subtitle</label>
        <textarea
          className="w-full border p-2 rounded mb-4"
          rows={2}
          value={content.heroSubtitle}
          onChange={bind("heroSubtitle")}
        />

        <label className="block mb-2 text-sm">Services Title</label>
        <input
          className="w-full border p-2 rounded mb-4"
          value={content.servicesTitle}
          onChange={bind("servicesTitle")}
        />

        <label className="block mb-2 text-sm">Contact Intro</label>
        <textarea
          className="w-full border p-2 rounded mb-6"
          rows={3}
          value={content.contactLead}
          onChange={bind("contactLead")}
        />

        <button
          onClick={reset}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Reset to default
        </button>
      </div>
    </div>
  );
}
