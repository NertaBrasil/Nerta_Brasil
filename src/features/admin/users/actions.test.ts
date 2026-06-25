import { beforeEach, describe, expect, it, vi } from "vitest";

const ADMIN_PROFILE = {
  id: "admin-1",
  name: "Admin",
  role: "admin" as const,
  created_at: "2026-01-01T00:00:00Z",
  email: "admin@nerta.com.br",
};

const EDITOR_PROFILE = {
  id: "editor-1",
  name: "Editor",
  role: "editor" as const,
  created_at: "2026-01-01T00:00:00Z",
  email: "editor@nerta.com.br",
};

const VALID_INPUT = {
  name: "Nova Editora",
  email: "nova-editora@nerta.com.br",
  password: "senha-segura-123",
  role: "editor" as const,
};

function createSingleQueryBuilder(data: unknown, error: unknown = null) {
  const builder: {
    insert: ReturnType<typeof vi.fn>;
    select: ReturnType<typeof vi.fn>;
    single: ReturnType<typeof vi.fn>;
  } = {
    insert: vi.fn(() => builder),
    select: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve({ data, error })),
  };
  return builder;
}

function createOrderQueryBuilder(data: unknown, error: unknown = null) {
  const builder: {
    select: ReturnType<typeof vi.fn>;
    order: ReturnType<typeof vi.fn>;
    then: (resolve: (value: { data: unknown; error: unknown }) => unknown) => Promise<unknown>;
  } = {
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
    // eslint-disable-next-line unicorn/no-thenable -- imita o builder thenable real do supabase-js
    then: (resolve) => Promise.resolve({ data, error }).then(resolve),
  };
  return builder;
}

const fromMock = vi.fn();
const getCurrentAdminProfileMock = vi.fn();
const createAuthUserMock = vi.fn();
const deleteAuthUserMock = vi.fn();
const listUsersMock = vi.fn();

vi.mock("@/infrastructure/supabase/admin", () => ({
  createAdminClient: vi.fn(() => ({
    from: fromMock,
    auth: {
      admin: {
        createUser: createAuthUserMock,
        deleteUser: deleteAuthUserMock,
        listUsers: listUsersMock,
      },
    },
  })),
}));

vi.mock("@/features/admin/auth", () => ({
  getCurrentAdminProfile: getCurrentAdminProfileMock,
}));

const { createUser, deleteUser, getAdminUsers } = await import("./actions");

describe("createUser", () => {
  beforeEach(() => {
    fromMock.mockReset();
    getCurrentAdminProfileMock.mockReset();
    createAuthUserMock.mockReset();
    deleteAuthUserMock.mockReset();
    getCurrentAdminProfileMock.mockResolvedValue(ADMIN_PROFILE);
  });

  it("rejeita quando o usuário atual não tem papel admin (editor)", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(EDITOR_PROFILE);

    const result = await createUser(VALID_INPUT);

    expect(createAuthUserMock).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });

  it("rejeita quando não há sessão administrativa autenticada", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(null);

    const result = await createUser(VALID_INPUT);

    expect(createAuthUserMock).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });

  it("cria o usuário em auth.users e em admin_profiles, retornando o AdminProfile completo", async () => {
    createAuthUserMock.mockResolvedValue({ data: { user: { id: "new-user-1" } }, error: null });
    const insertBuilder = createSingleQueryBuilder({
      id: "new-user-1",
      name: "Nova Editora",
      role: "editor",
      created_at: "2026-01-02T00:00:00Z",
    });
    fromMock.mockReturnValue(insertBuilder);

    const result = await createUser(VALID_INPUT);

    expect(createAuthUserMock).toHaveBeenCalledWith({
      email: "nova-editora@nerta.com.br",
      password: "senha-segura-123",
      email_confirm: true,
    });
    expect(insertBuilder.insert).toHaveBeenCalledWith({
      id: "new-user-1",
      name: "Nova Editora",
      role: "editor",
    });
    expect(result).toEqual({
      success: true,
      data: {
        id: "new-user-1",
        name: "Nova Editora",
        role: "editor",
        created_at: "2026-01-02T00:00:00Z",
        email: "nova-editora@nerta.com.br",
      },
    });
  });

  it("mapeia erro de e-mail duplicado sem inserir em admin_profiles", async () => {
    createAuthUserMock.mockResolvedValue({
      data: { user: null },
      error: { code: "email_exists", message: "Email already registered" },
    });

    const result = await createUser(VALID_INPUT);

    expect(fromMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: "Já existe um usuário com esse e-mail.",
    });
  });

  it("desfaz a criação em auth.users se a inserção em admin_profiles falhar", async () => {
    createAuthUserMock.mockResolvedValue({ data: { user: { id: "new-user-1" } }, error: null });
    const insertBuilder = createSingleQueryBuilder(null, { code: "23505" });
    fromMock.mockReturnValue(insertBuilder);

    const result = await createUser(VALID_INPUT);

    expect(deleteAuthUserMock).toHaveBeenCalledWith("new-user-1");
    expect(result.success).toBe(false);
  });

  it("rejeita input inválido sem chamar a Admin API", async () => {
    const result = await createUser({ ...VALID_INPUT, email: "nao-e-email" });

    expect(createAuthUserMock).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });
});

describe("deleteUser", () => {
  beforeEach(() => {
    fromMock.mockReset();
    getCurrentAdminProfileMock.mockReset();
    deleteAuthUserMock.mockReset();
    getCurrentAdminProfileMock.mockResolvedValue(ADMIN_PROFILE);
  });

  it("rejeita quando o usuário atual não tem papel admin", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(EDITOR_PROFILE);

    const result = await deleteUser("outro-usuario");

    expect(deleteAuthUserMock).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });

  it("exclui um usuário diferente do atual chamando auth.admin.deleteUser", async () => {
    deleteAuthUserMock.mockResolvedValue({ data: {}, error: null });

    const result = await deleteUser("outro-usuario");

    expect(deleteAuthUserMock).toHaveBeenCalledWith("outro-usuario");
    expect(result).toEqual({ success: true, data: undefined });
  });

  it("bloqueia a autoexclusão sem chamar a Admin API", async () => {
    const result = await deleteUser(ADMIN_PROFILE.id);

    expect(deleteAuthUserMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: "Você não pode excluir a própria conta.",
    });
  });

  it("rejeita quando não há sessão administrativa autenticada", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(null);

    const result = await deleteUser("outro-usuario");

    expect(deleteAuthUserMock).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });
});

describe("getAdminUsers", () => {
  beforeEach(() => {
    fromMock.mockReset();
    getCurrentAdminProfileMock.mockReset();
    listUsersMock.mockReset();
    getCurrentAdminProfileMock.mockResolvedValue(ADMIN_PROFILE);
  });

  it("rejeita quando o usuário atual não tem papel admin", async () => {
    getCurrentAdminProfileMock.mockResolvedValue(EDITOR_PROFILE);

    const result = await getAdminUsers();

    expect(fromMock).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
  });

  it("retorna a lista de usuários ordenada por name, com e-mail resolvido de auth.users", async () => {
    const orderBuilder = createOrderQueryBuilder([
      { id: "admin-1", name: "Admin", role: "admin", created_at: "2026-01-01T00:00:00Z" },
      { id: "editor-1", name: "Editor", role: "editor", created_at: "2026-01-01T00:00:00Z" },
    ]);
    fromMock.mockReturnValue(orderBuilder);
    listUsersMock.mockResolvedValue({
      data: {
        users: [
          { id: "admin-1", email: "admin@nerta.com.br" },
          { id: "editor-1", email: "editor@nerta.com.br" },
        ],
      },
      error: null,
    });

    const result = await getAdminUsers();

    expect(orderBuilder.order).toHaveBeenCalledWith("name", { ascending: true });
    expect(result).toEqual({
      success: true,
      data: [
        {
          id: "admin-1",
          name: "Admin",
          role: "admin",
          created_at: "2026-01-01T00:00:00Z",
          email: "admin@nerta.com.br",
        },
        {
          id: "editor-1",
          name: "Editor",
          role: "editor",
          created_at: "2026-01-01T00:00:00Z",
          email: "editor@nerta.com.br",
        },
      ],
    });
  });
});
