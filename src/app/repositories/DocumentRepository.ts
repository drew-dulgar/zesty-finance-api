import { zestyFinanceDb } from '../../db/index.js';
import type {
  AccountDocumentAcceptanceInsertable,
  DocumentSelectable,
  DocumentTypeSelectable,
} from './zesty-finance-db.js';

export type DocumentWithType = DocumentSelectable & {
  type_slug: DocumentTypeSelectable['slug'];
  type_name: DocumentTypeSelectable['name'];
};

export type DocumentWithAcceptance = DocumentWithType & {
  accepted_at: Date | null;
};

const getAcceptedOrActive = (
  accountId: string,
  documentTypeSlug: string | undefined,
): Promise<DocumentWithAcceptance[]> => {
  let query = zestyFinanceDb
    .selectFrom('documents as d')
    .innerJoin('document_types as dt', 'dt.id', 'd.document_type_id')
    .leftJoin('account_document_acceptances as ada', (join) =>
      join
        .onRef('ada.document_id', '=', 'd.id')
        .on('ada.account_id', '=', accountId),
    )
    .select([
      'd.id',
      'd.document_type_id',
      'd.version',
      'd.content',
      'd.effective_date',
      'd.is_active',
      'd.created_at',
      'd.updated_at',
      'dt.slug as type_slug',
      'dt.name as type_name',
      'ada.accepted_at',
    ])
    .where((eb) =>
      eb.or([
        eb('ada.document_id', 'is not', null),
        eb('d.is_active', '=', true),
      ]),
    )
    .orderBy((eb) =>
      eb
        .case()
        .when(
          eb.and([
            eb('ada.accepted_at', 'is', null),
            eb('d.is_active', '=', true),
          ]),
        )
        .then(0)
        .when(
          eb.and([
            eb('ada.accepted_at', 'is not', null),
            eb('d.is_active', '=', true),
          ]),
        )
        .then(1)
        .else(2)
        .end(),
    )
    .orderBy('d.effective_date', 'desc');

  if (typeof documentTypeSlug !== 'undefined') {
    query = query.where('dt.slug', '=', documentTypeSlug);
  }

  return query.execute() as Promise<DocumentWithAcceptance[]>;
};

const getPending = (accountId: string): Promise<DocumentWithType[]> => {
  return zestyFinanceDb
    .selectFrom('documents as d')
    .innerJoin('document_types as dt', 'dt.id', 'd.document_type_id')
    .leftJoin('account_document_acceptances as ada', (join) =>
      join
        .onRef('ada.document_id', '=', 'd.id')
        .on('ada.account_id', '=', accountId),
    )
    .select([
      'd.id',
      'd.document_type_id',
      'd.version',
      'd.content',
      'd.effective_date',
      'd.is_active',
      'd.created_at',
      'd.updated_at',
      'dt.slug as type_slug',
      'dt.name as type_name',
    ])
    .where('d.is_active', '=', true)
    .where('ada.document_id', 'is', null)
    .execute();
};

const getActive = (): Promise<DocumentWithType[]> => {
  return zestyFinanceDb
    .selectFrom('documents as d')
    .innerJoin('document_types as dt', 'dt.id', 'd.document_type_id')
    .select([
      'd.id',
      'd.document_type_id',
      'd.version',
      'd.content',
      'd.effective_date',
      'd.is_active',
      'd.created_at',
      'd.updated_at',
      'dt.slug as type_slug',
      'dt.name as type_name',
    ])
    .where('d.is_active', '=', true)
    .execute();
};

const recordAcceptances = (
  accountId: string,
  documentIds: string[],
): Promise<unknown> => {
  if (documentIds.length === 0) return Promise.resolve();

  const values: AccountDocumentAcceptanceInsertable[] = documentIds.map(
    (documentId) => ({ account_id: accountId, document_id: documentId }),
  );

  return zestyFinanceDb
    .insertInto('account_document_acceptances')
    .values(values)
    .onConflict((oc) =>
      oc
        .constraint('account_document_acceptances_account_document_key')
        .doNothing(),
    )
    .execute();
};

export default {
  getActive,
  getAcceptedOrActive,
  getPending,
  recordAcceptances,
};
