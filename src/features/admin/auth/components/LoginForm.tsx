"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { login } from "../actions";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [blocked, setBlocked] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const result = await login({ email, password });

    if (!result.success) {
      const isRateLimit = result.error.startsWith("Muitas tentativas");
      setBlocked(isRateLimit);
      setError(result.error);
      setPending(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <Input
        label="E-mail"
        type="email"
        placeholder="admin@nerta.com.br"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        disabled={blocked}
      />
      <Input
        label="Senha"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={blocked}
      />
      {error && (
        <p
          className={`font-body text-sm ${blocked ? "text-[#C9951A]" : "text-[#E5634D]"}`}
          role="alert"
        >
          {error}
        </p>
      )}
      <Button type="submit" size="lg" fullWidth disabled={pending || blocked}>
        {pending ? "Entrando..." : blocked ? "Acesso bloqueado" : "Acessar painel"}
      </Button>
    </form>
  );
}
