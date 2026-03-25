import type { NextFunction, Request, Response } from 'express';

const error404Middleware = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  res.status(404).json({
    status: 404,
    message: 'The requested resource could not be found.',
  });
};

export default error404Middleware;
