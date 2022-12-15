// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import firebaseConfig from '../assets/emulators.json';

export const environment = {
  firebase: {
    projectId: 'myfairlady-ec6a3',
    appId: '1:157587387823:web:51a3336325fd9bb6efab5a',
    databaseURL: 'https://myfairlady-ec6a3-default-rtdb.europe-west1.firebasedatabase.app',
    storageBucket: 'myfairlady-ec6a3.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyAs41bCHSboDnA0Q0IwN_XHfga-J2tnTYg',
    authDomain: 'myfairlady-ec6a3.firebaseapp.com',
    messagingSenderId: '157587387823',
    measurementId: 'G-GRD5Z6CCBG',
  },
  production: false,
  firebasePorts: {
    functionsPort: firebaseConfig.functionsPort,
    firestorePort: firebaseConfig.firestorePort,
    hostingPort: firebaseConfig.hostingPort,
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
