
import { db, rtdb } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, set } from 'firebase/database';

async function addTestData() {
  // Add data to Firestore
  const firestoreRef = doc(db, 'testData', 'firestore-test');
  await setDoc(firestoreRef, { 
    name: 'Firestore Test', 
    timestamp: new Date().toISOString() 
  });

  // Add data to Realtime Database
  const rtdbRef = ref(rtdb, 'testData/rtdb-test');
  await set(rtdbRef, { 
    name: 'Realtime Database Test', 
    timestamp: new Date().toISOString() 
  });
}

addTestData().then(() => {
  console.log('Test data added successfully.');
}).catch((error) => {
  console.error('Error adding test data:', error);
});
