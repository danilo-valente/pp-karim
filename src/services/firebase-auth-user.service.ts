import {BindingScope, inject, injectable} from '@loopback/core';
import {UserService} from '@loopback/authentication';
import {User} from '@loopback/authentication-jwt/src/models';
import {securityId, UserProfile} from '@loopback/security';
import {HttpErrors} from '@loopback/rest';
import FirebaseAdmin from 'firebase-admin';
import {ServiceBindings} from './index';

export interface Credentials {
  email: string;
  password: string;
}

@injectable({scope: BindingScope.TRANSIENT})
export class FirebaseAuthUserService implements UserService<User, Credentials> {

  private readonly firebaseAuth: FirebaseAdmin.auth.Auth;

  constructor(
    @inject(ServiceBindings.FIREBASE_APP) firebaseApp: FirebaseAdmin.app.App
  ) {
    this.firebaseAuth = firebaseApp.auth();
  }

  async verifyCredentials({email, password}: Credentials): Promise<User> {
    const invalidCredentialsError = 'Invalid email or password.';

    const user = await this.firebaseAuth.getUserByEmail(email);

    if (!user) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    // user.passwordHash

    // this.firebaseAuth.signInWithCustomToken()
    throw 1;
  }

  async createUser({email, password}: Credentials): Promise<User> {
    await this.firebaseAuth.createUser({
      email,
      password
    });

    // @ts-ignore
    return {email, password};
  }

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.id.toString(),
      name: user.username,
      id: user.id,
      email: user.email,
    };
  }
}
