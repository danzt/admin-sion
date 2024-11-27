import { Timestamp as FirestoreTimestamp } from 'firebase/firestore';

export type Primitive = string | number | boolean | null | undefined;
export type JsonValue = Primitive | { [key: string]: JsonValue } | JsonValue[];

export interface BaseDocument {
  id: string;
  createdAt: Date | FirestoreTimestamp;
  updatedAt: Date | FirestoreTimestamp;
}

export interface FirebaseDocument<T> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, JsonValue>;
  data: () => T;
}

// export interface Timestamp {
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface Auditable {
  createdBy: string;
  updatedBy: string;
}
