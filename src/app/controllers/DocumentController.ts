import type { NextFunction, Request, Response } from 'express';
import type { LegalDocument } from 'zesty-finance-shared';
import { DocumentRepository } from '../repositories/index.js';

const getActive = async (
  _req: Request,
  res: Response<LegalDocument[]>,
  next: NextFunction,
): Promise<void> => {
  try {
    const documents = await DocumentRepository.getActive();

    res.json(
      documents.map((d) => ({
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
      })),
    );
  } catch (error) {
    next(error);
  }
};

export default { getActive };
