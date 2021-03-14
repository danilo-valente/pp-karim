import {BindingKey} from '@loopback/core';
import FirebaseAdmin from 'firebase-admin';

export namespace ServiceBindings {

  export const FIREBASE_APP = BindingKey.create<FirebaseAdmin.app.App>('firebase');

  export const FIREBASE_AUTH = BindingKey.create<FirebaseAdmin.auth.Auth>('firebase.auth');
}
