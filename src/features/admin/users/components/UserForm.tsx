"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/components/ui/Input";
import { Select } from "@/shared/components/ui/Select";
import { Button } from "@/shared/components/ui/Button";
import { createUser } from "../actions";
import type { AdminRole } from "../types";

const ROLE_OPTIONS = [
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Admin" },
];

export function UserForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("editor");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const result = await createUser({ name, email, password, role });

    if (!result.success) {
      setError(result.error);
      setPending(false);
      return;
    }

    setName("");
    setEmail("");
    setPassword("");
    setRole("editor");
    setPending(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <Input
        label="Nome"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Input
        label="E-mail"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        label="Senha"
        type="password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Select
        label="Papel"
        options={ROLE_OPTIONS}
        value={role}
        onChange={(event) => setRole(event.target.value as AdminRole)}
      />
      {error && (
        <p className="font-body text-sm text-[#E5634D]" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Criando..." : "Criar usuário"}
      </Button>
    </form>
  );
}
