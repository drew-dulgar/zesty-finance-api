import { Generated, ColumnType, Insertable, Selectable, Updateable } from 'kysely'

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface AccountTable {
  accountPlanId: number;
  createdAt: Generated<Timestamp>;
  email: string;
  emailVerified: Generated<boolean>;
  firstName: string | null;
  id: Generated<number>;
  isActive: Generated<boolean>;
  isDeleted: Generated<boolean>;
  lastLogin: Timestamp | null;
  lastName: string | null;
  middleName: string | null;
  password: Buffer | null;
  salt: Buffer | null;
  updatedAt: Generated<Timestamp>;
  username: string | null;
};

export type AccountSelectable = Selectable<AccountTable>;
export type AccountInsertable = Insertable<AccountTable>;
export type AccountUpdateable = Updateable<AccountTable>;