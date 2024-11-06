import type { Request, Response, NextFunction } from 'express';

const error404Middleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  res.status(404).json({
    status: 404,
    message: 'The requested resource could not be found.'
  })
};

export default error404Middleware;