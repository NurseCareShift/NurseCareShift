declare module 'passport-apple' {
    import passport = require('passport');
  
    interface VerifyCallback {
      (error: any, user?: any, info?: any): void;
    }
  
    interface Profile {
      id: string;
      email?: string;
    }
  
    interface StrategyOptions {
      clientID: string;
      teamID: string;
      keyID: string;
      privateKey: string;
      callbackURL: string;
      scope?: string[];
    }
  
    class Strategy extends passport.Strategy {
      constructor(options: StrategyOptions, verify: (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => void);
    }
  
    export = Strategy;
  }
  