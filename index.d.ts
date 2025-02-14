import { IJwtPayload } from 'src/common/types/jwt-payload.type';

declare global {
  namespace Express {
    interface Request {
      user: IJwtPayload;
    }
  }
}
