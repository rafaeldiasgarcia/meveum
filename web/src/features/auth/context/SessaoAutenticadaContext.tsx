"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { logout, obterToken, obterUsuarioAutenticado, obterUsuarioSalvo } from "@/lib/api/auth.api";
import type { Usuario } from "@/types";

type SessaoAutenticadaContextValue = {
  usuario: Usuario | null;
  carregando: boolean;
  sair: () => Promise<void>;
};

const SessaoAutenticadaContext = createContext<SessaoAutenticadaContextValue | null>(null);

export function SessaoAutenticadaProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    const token = obterToken();
    const usuarioSalvo = obterUsuarioSalvo();

    if (usuarioSalvo) {
      setUsuario(usuarioSalvo);
    }

    if (!token) {
      setCarregando(false);
      router.replace("/login");
      return;
    }

    obterUsuarioAutenticado()
      .then((usuarioAutenticado) => {
        if (ativo) {
          setUsuario(usuarioAutenticado);
        }
      })
      .catch(async () => {
        await logout();
        if (ativo) {
          setUsuario(null);
          router.replace("/login");
        }
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [router]);

  async function sair() {
    await logout();
    setUsuario(null);
    router.replace("/login");
  }

  const value = useMemo(
    () => ({ usuario, carregando, sair }),
    [usuario, carregando]
  );

  return (
    <SessaoAutenticadaContext.Provider value={value}>
      {children}
    </SessaoAutenticadaContext.Provider>
  );
}

export function useSessaoAutenticada() {
  const context = useContext(SessaoAutenticadaContext);
  if (!context) {
    throw new Error("useSessaoAutenticada deve ser usado dentro de SessaoAutenticadaProvider.");
  }
  return context;
}
