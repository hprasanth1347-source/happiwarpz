export type UserRole = "CUSTOMER" | "ADMIN";
export type AccountStatus = "ACTIVE" | "SUSPENDED";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  accountStatus: AccountStatus;
  profileImage?: string;
  createdAt?: string;
}
