import type { NextFunction, Request, Response } from 'express';
import type { DocumentAcceptance } from 'zesty-finance-shared';
import { DocumentRepository } from '../../../repositories/index.js';

const get = async (
  req: Request,
  res: Response<DocumentAcceptance[]>,
  next: NextFunction,
): Promise<void> => {
  try {
    const documentType = req.query.documentType as string | undefined;
    const docs = await DocumentRepository.getAcceptedOrActive(req.account!.id, documentType);

    res.json(
      docs.map((d) => ({
        document: {
          id: d.id,
          version: d.version,
          content: d.content,
          effectiveDate: new Date(d.effective_date).toISOString(),
          isActive: d.is_active,
          type: {
            id: d.document_type_id,
            slug: d.type_slug,
            name: d.type_name,
          },
        },
        acceptedAt: d.accepted_at ? d.accepted_at.toISOString() : null,
      })),
    );
  } catch (error) {
    next(error);
  }
};

const accept = async (
  req: Request,
  res: Response<{ success: boolean }>,
  next: NextFunction,
): Promise<void> => {
  try {
    const pending = await DocumentRepository.getPending(req.account!.id);
    await DocumentRepository.recordAcceptances(
      req.account!.id,
      pending.map((d) => d.id),
    );
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export default { get, accept };
