import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, LogOut, Pencil, Plus, Trash2, X } from "lucide-react";
import api, { formatApiError } from "@/api";
import { SardineIcon } from "@/components/Sardine";

const CATEGORIES = ["petiscos", "vinhos", "cervejas"];
const emptyForm = {
  category: "petiscos",
  name_pt: "",
  name_en: "",
  description_pt: "",
  description_en: "",
  price: "",
  order: 0,
  available: true,
};

function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      onSuccess(data);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-2xl border border-gold/15 bg-coal/80 p-8 shadow-2xl shadow-black/50" data-testid="admin-login-form">
      <div className="flex flex-col items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-cream">
          <img src="/assets/logo.png" alt="Ti Maria" className="h-full w-full object-cover" />
        </span>
        <h1 className="font-serif text-2xl italic text-cream">Cozinha da Ti Maria</h1>
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-sand">Área do Sr. Ângelo</p>
      </div>
      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-widest text-sand" htmlFor="admin-email">Email</label>
        <input
          id="admin-email"
          data-testid="admin-email-input"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gold/20 bg-ink px-4 py-2.5 text-cream outline-none transition-colors focus:border-gold"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-widest text-sand" htmlFor="admin-password">Palavra-passe</label>
        <input
          id="admin-password"
          data-testid="admin-password-input"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gold/20 bg-ink px-4 py-2.5 text-cream outline-none transition-colors focus:border-gold"
        />
      </div>
      {error && <p className="text-sm text-terra" data-testid="admin-login-error">{error}</p>}
      <button
        data-testid="admin-login-submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-terra py-3 text-sm font-semibold uppercase tracking-widest text-cream transition-colors hover:bg-gold hover:text-ink disabled:opacity-60"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        Entrar
      </button>
    </form>
  );
}

function ItemForm({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(initial?.id);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (isEdit) {
        await api.put(`/menu/${initial.id}`, form);
      } else {
        await api.post("/menu", { ...form, order: Number(form.order) || 0 });
      }
      onSaved();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  const field = (key, label, type = "text") => (
    <div>
      <label className="mb-1 block text-xs uppercase tracking-widest text-sand">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => set(key, type === "number" ? Number(e.target.value) : e.target.value)}
        className="w-full rounded-lg border border-gold/20 bg-ink px-3.5 py-2.5 text-sm text-cream outline-none focus:border-gold"
        required={key.startsWith("name")}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm" data-testid="admin-menu-dialog">
      <form onSubmit={submit} className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-2xl border border-gold/15 bg-coal p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl italic text-cream">{isEdit ? "Editar item" : "Novo item"}</h2>
          <button type="button" onClick={onClose} data-testid="admin-dialog-close" className="text-sand hover:text-cream">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-widest text-sand">Categoria</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            data-testid="admin-item-category"
            className="w-full rounded-lg border border-gold/20 bg-ink px-3.5 py-2.5 text-sm text-cream outline-none focus:border-gold"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("name_pt", "Nome (PT)")}
          {field("name_en", "Nome (EN)")}
          {field("description_pt", "Descrição (PT)")}
          {field("description_en", "Descrição (EN)")}
          {field("price", "Preço (ex: 8,50€)")}
          {field("order", "Ordem", "number")}
        </div>
        <label className="flex items-center gap-2.5 text-sm text-sand">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => set("available", e.target.checked)}
            data-testid="admin-item-available"
            className="h-4 w-4 accent-terra"
          />
          Disponível na ementa
        </label>
        {error && <p className="text-sm text-terra" data-testid="admin-form-error">{error}</p>}
        <button
          data-testid="admin-item-save"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-terra py-3 text-sm font-semibold uppercase tracking-widest text-cream transition-colors hover:bg-gold hover:text-ink disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Guardar
        </button>
      </form>
    </div>
  );
}

export default function Admin() {
  const [user, setUser] = useState(undefined);
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get("/menu").then((r) => setItems(r.data)).catch(() => {});

  useEffect(() => {
    api.get("/auth/me").then((r) => setUser(r.data)).catch(() => setUser(false));
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user]);

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    setUser(false);
  };

  const remove = async (item) => {
    if (!window.confirm(`Apagar "${item.name_pt}"?`)) return;
    await api.delete(`/menu/${item.id}`);
    load();
  };

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <SardineIcon className="w-16 animate-pulse text-gold/60" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-ink px-5">
        <LoginForm onSuccess={setUser} />
        <Link to="/" data-testid="admin-back-home" className="flex items-center gap-2 text-sm text-sand hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Voltar à taberna
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink px-5 py-10 text-cream sm:px-8" data-testid="admin-dashboard">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl italic">Ementa da casa</h1>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-sand">
              Bem-vindo, {user.name || "Sr. Ângelo"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              data-testid="admin-add-item-button"
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="flex items-center gap-2 rounded-full bg-terra px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-gold hover:text-ink"
            >
              <Plus className="h-4 w-4" /> Novo item
            </button>
            <button
              data-testid="admin-logout-button"
              onClick={logout}
              className="flex items-center gap-2 rounded-full border border-gold/25 px-4 py-2.5 text-sm text-sand transition-colors hover:border-gold hover:text-gold"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>

        {CATEGORIES.map((cat) => {
          const list = items.filter((i) => i.category === cat);
          return (
            <section key={cat} className="mt-10" data-testid={`admin-category-${cat}`}>
              <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-terra">{cat} · {list.length}</h2>
              <ul className="mt-4 divide-y divide-gold/10 rounded-2xl border border-gold/15 bg-coal/60">
                {list.length === 0 && <li className="px-5 py-6 text-sm italic text-sand">Sem itens.</li>}
                {list.map((item) => (
                  <li key={item.id} data-testid="admin-menu-item" className="flex flex-wrap items-center gap-4 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-lg">
                        {item.name_pt}
                        {!item.available && <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-terra">· esgotado</span>}
                      </p>
                      <p className="truncate text-sm text-sand">{item.description_pt}</p>
                    </div>
                    <span className="font-mono text-sm text-gold">{item.price}</span>
                    <button
                      data-testid={`admin-edit-${item.id}`}
                      onClick={() => { setEditing(item); setShowForm(true); }}
                      className="rounded-full border border-gold/20 p-2 text-sand transition-colors hover:border-gold hover:text-gold"
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      data-testid={`admin-delete-${item.id}`}
                      onClick={() => remove(item)}
                      className="rounded-full border border-terra/30 p-2 text-terra/80 transition-colors hover:border-terra hover:text-terra"
                      aria-label="Apagar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <Link to="/" className="mt-12 inline-flex items-center gap-2 text-sm text-sand hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Voltar à taberna
        </Link>
      </div>

      {showForm && (
        <ItemForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}
    </div>
  );
}
