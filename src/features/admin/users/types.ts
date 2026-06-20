export type AdminRole = "admin" | "editor";

export type AdminProfile = {
  id: string;
  name: string;
  role: AdminRole;
  created_at: string;
  /** Vem de auth.users, não de admin_profiles */
  email: string;
};
