import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useCurrentUser";
import Navbar from "@/components/Navbar";

const Perfil = () => {
  const { user, loading } = useAuthState();
  const navigate = useNavigate();
  const [apodo, setApodo] = useState("");
  const [nombre, setNombre] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      setApodo(user.apodo);
      setNombre(user.nombre ?? "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!apodo.trim()) {
      toast.error("El apodo no puede estar vacío");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, apodo: apodo.trim(), nombre: nombre.trim() || null });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Perfil actualizado");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)] text-muted-foreground">
          Cargando…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="container mx-auto max-w-2xl px-4 py-10">
          <h1 className="text-3xl font-bold mb-2">Mi perfil</h1>
          <p className="text-muted-foreground mb-8">Gestiona tu información pública.</p>

          <form onSubmit={handleSave} className="space-y-5 bg-card border border-border rounded-2xl p-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apodo">Apodo público</Label>
              <Input id="apodo" value={apodo} onChange={(e) => setApodo(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre (opcional)</Label>
              <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
