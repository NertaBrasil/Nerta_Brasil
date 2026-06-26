export type AdminRole = "admin" | "editor" | "partner_viewer";

export type AdminProfile = {
  id: string;
  name: string;
  role: AdminRole;
  created_at: string;
  /** Vem de auth.users, não de admin_profiles */
  email: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
};
