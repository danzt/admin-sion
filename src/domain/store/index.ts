import { User, ParamsUserCredentials } from '../user';

export interface Store {
  users: User[];
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (record: User) => Promise<void>;
  setUser: (user: User | never) => Promise<void>;
  createUser: (params: ParamsUserCredentials) => Promise<void>;
  doSignInWithEmailAndPassword: (
    params: ParamsUserCredentials
  ) => Promise<void>;
  doSendPasswordResetEmail: (params: string) => Promise<void>;
  doSendEmailVerification: () => Promise<void>;
  doUpdatePassword: (params: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}
