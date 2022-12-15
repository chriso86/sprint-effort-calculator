const fs = require('fs');
const firebaseConfig = require('../firebase.json');

fs.writeFileSync('angular/src/assets/emulators.json', JSON.stringify({
    functionsPort: firebaseConfig.emulators.functions.port,
    firestorePort: firebaseConfig.emulators.firestore.port,
    hostingPort: firebaseConfig.emulators.hosting.port,
}));
