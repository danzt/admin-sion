import { Auditable, BaseDocument } from '../base';
import { Timestamp as FirestoreTimestamp } from 'firebase/firestore';

export type FirebaseDate = Date | FirestoreTimestamp;

export type UserStatus = 'active' | 'inactive';

export type UserRole = 'admin' | 'user' | 'guest';

export interface UserBasic {
  name: string;
  lastName: string;
  displayName: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
}

export interface User extends UserBasic, Auditable, BaseDocument {
  role: UserRole;
  status: UserStatus;
  createdAt: FirebaseDate;
  updatedAt: FirebaseDate;
}
