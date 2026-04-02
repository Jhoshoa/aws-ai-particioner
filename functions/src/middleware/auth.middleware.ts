import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase.config';
import { AuthUser } from '../types';
import { AuthError, ForbiddenError } from '../types/errors';

// Extend Express Request to include user property
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Extract Bearer token from Authorization header
 */
function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Middleware to verify Firebase Auth token
 * Attaches user info to request object
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      throw new AuthError('No authentication token provided');
    }

    // Verify the token with Firebase Auth
    const decodedToken = await auth.verifyIdToken(token);

    // Build user object from token
    const user: AuthUser = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      displayName: decodedToken.name || null,
      photoURL: decodedToken.picture || null,
      emailVerified: decodedToken.email_verified || false,
      isAdmin: decodedToken.admin === true,
      customClaims: decodedToken,
    };

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof AuthError) {
      next(error);
    } else {
      // Firebase auth errors
      next(new AuthError('Invalid or expired authentication token'));
    }
  }
}

/**
 * Middleware to optionally authenticate
 * Does not throw if no token, but attaches user if valid token exists
 */
export async function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      return next();
    }

    const decodedToken = await auth.verifyIdToken(token);

    const user: AuthUser = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      displayName: decodedToken.name || null,
      photoURL: decodedToken.picture || null,
      emailVerified: decodedToken.email_verified || false,
      isAdmin: decodedToken.admin === true,
      customClaims: decodedToken,
    };

    req.user = user;
    next();
  } catch {
    // Token invalid, continue without user
    next();
  }
}

/**
 * Middleware to require admin role
 * Must be used after authenticate middleware
 */
export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    return next(new AuthError('Authentication required'));
  }

  if (!req.user.isAdmin) {
    return next(new ForbiddenError('Admin access required'));
  }

  next();
}

/**
 * Middleware to require specific custom claim
 */
export function requireClaim(claimKey: string, claimValue?: unknown) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      return next(new AuthError('Authentication required'));
    }

    const claims = req.user.customClaims;
    if (!claims || claims[claimKey] === undefined) {
      return next(new ForbiddenError(`Required claim '${claimKey}' not found`));
    }

    if (claimValue !== undefined && claims[claimKey] !== claimValue) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
}

/**
 * Middleware to require resource ownership
 * Compares user ID with a field in request params or body
 */
export function requireOwnership(userIdField = 'userId') {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      return next(new AuthError('Authentication required'));
    }

    const resourceUserId =
      req.params[userIdField] || req.body[userIdField];

    if (!resourceUserId) {
      return next(new ForbiddenError('Resource ownership cannot be determined'));
    }

    // Admins can access any resource
    if (req.user.isAdmin) {
      return next();
    }

    if (req.user.uid !== resourceUserId) {
      return next(new ForbiddenError('You do not own this resource'));
    }

    next();
  };
}
