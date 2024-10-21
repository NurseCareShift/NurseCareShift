// csurf.d.ts
declare module 'csurf' {
    import { RequestHandler } from 'express';
  
    interface CookieOptions {
      key?: string;
      path?: string;
      signed?: boolean;
      secure?: boolean;
      maxAge?: number;
      httpOnly?: boolean;
      sameSite?: boolean | 'lax' | 'strict' | 'none';
    }
  
    interface Options {
      value?: (req: Express.Request) => string;
      cookie?: boolean | CookieOptions;
      ignoreMethods?: string[];
      sessionKey?: string;
    }
  
    function csurf(options?: Options): RequestHandler;
  
    export = csurf;
  }
  