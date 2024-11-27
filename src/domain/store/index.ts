import { User } from '../user';

export interface Store {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (record: User) => Promise<void>;
}
