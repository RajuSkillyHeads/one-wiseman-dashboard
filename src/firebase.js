import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCCoSQBxFDuB73uSMqhojXInyh2r5grrw8",
  authDomain: "one-wiseman.firebaseapp.com",
  databaseURL: "https://one-wiseman-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "one-wiseman",
  storageBucket: "one-wiseman.firebasestorage.app",
  messagingSenderId: "256200373474",
  appId: "1:256200373474:web:01fea42301cb4fdd601abb",
  measurementId: "G-09NVNGCV6N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Helper function to convert Firestore timestamps
function convertValue(val) {
  if (val == null) return val;
  if (Array.isArray(val)) return val.map(convertValue);
  if (val && typeof val === 'object' && val.toDate && typeof val.toDate === 'function') {
    return { "__time__": val.toDate().toISOString() };
  }
  if (typeof val === 'object') {
    const out = {};
    for (const k of Object.keys(val)) out[k] = convertValue(val[k]);
    return out;
  }
  return val;
}

// Helper function to convert collection to map
async function collectionToMap(path) {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const snap = await getDocs(collection(db, path));
    const map = {};
    snap.forEach(d => { map[d.id] = convertValue(d.data() || {}); });
    return map;
  } catch (e) {
    console.warn(`collectionToMap(${path}) failed:`, e);
    return {};
  }
}

// Helper function to convert subcollection to map
async function subcollectionToMap(parentPath, subcollection) {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const ref = collection(db, `${parentPath}/${subcollection}`);
    const snap = await getDocs(ref);
    const out = {};
    snap.forEach(doc => { out[doc.id] = convertValue(doc.data() || {}); });
    return out;
  } catch (e) {
    console.warn(`subcollectionToMap(${parentPath}/${subcollection}) failed:`, e);
    return {};
  }
}

// Helper function to merge objects deeply
function mergeDeep(target, source) {
  for (const k of Object.keys(source)) {
    if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k])) {
      if (!target[k] || typeof target[k] !== 'object') target[k] = {};
      mergeDeep(target[k], source[k]);
    } else {
      target[k] = source[k];
    }
  }
  return target;
}

// Function to attach client subcollections
async function attachClientSubcollections(clientId, clientObj) {
  const base = `clients/${clientId}`;
  const [batches, assignments, assessments, questions] = await Promise.all([
    subcollectionToMap(base, 'batches'),
    subcollectionToMap(base, 'assignments'),
    subcollectionToMap(base, 'assessments'),
    subcollectionToMap(base, 'questions')
  ]);
  clientObj.batches = clientObj.batches || batches;
  clientObj.assignments = clientObj.assignments || assignments;
  clientObj.assessments = clientObj.assessments || assessments;
  clientObj.questions = clientObj.questions || questions;

  const batchIds = Object.keys(clientObj.batches || {});
  await Promise.all(batchIds.map(async (batchId) => {
    const batchPath = `${base}/batches/${batchId}`;
    const [bAssign, bAssess] = await Promise.all([
      subcollectionToMap(batchPath, 'assignments'),
      subcollectionToMap(batchPath, 'assessments')
    ]);
    clientObj.batches[batchId].assignments = clientObj.batches[batchId].assignments || bAssign;
    clientObj.batches[batchId].assessments = clientObj.batches[batchId].assessments || bAssess;
  }));
}

// Function to load submissions
async function loadSubmissions() {
  const out = {};
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const root = await getDocs(collection(db, 'submissions'));
    const tasks = root.docs.map(async (doc) => {
      const clientId = doc.id;
      const inline = convertValue(doc.data() || {});
      const parent = `submissions/${clientId}`;
      const [assignments, assessments] = await Promise.all([
        subcollectionToMap(parent, 'assignments'),
        subcollectionToMap(parent, 'assessments')
      ]);
      const merged = { assignments: {}, assessments: {} };
      if (inline.assignments) mergeDeep(merged.assignments, inline.assignments);
      if (inline.assessments) mergeDeep(merged.assessments, inline.assessments);
      mergeDeep(merged.assignments, assignments);
      mergeDeep(merged.assessments, assessments);
      out[clientId] = merged;
    });
    await Promise.all(tasks);
  } catch (e) {
    console.warn('loadSubmissions failed:', e);
  }
  return out;
}

// Main function to fetch dashboard data
export async function fetchDashboardData() {
  console.log('[firebase-data] fetchDashboardData start');
  
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
    console.log('[firebase-data] anonymous user uid=', (auth.currentUser && auth.currentUser.uid));
  } catch (e) {
    console.warn('Anonymous auth failed (continuing):', e);
  }

  // Try to ping Firestore with a simple query
  try {
    const { collection, getDocs, limit, query } = await import('firebase/firestore');
    await getDocs(query(collection(db, '__ping__'), limit(1)));
    console.log('[firebase-data] ping success');
  } catch (e) {
    console.error('[firebase-data] ping failed:', e);
    // Instead of throwing an error, let's try to continue and see if we can load data
    console.log('[firebase-data] Continuing without ping...');
  }

  let clients = {}, client_config = {}, questions = {}, users = {}, batches = {}, public_config = {}, private_config = {}, submissions = {};
  
  try {
    [clients, client_config, questions, users, batches, public_config, private_config] = await Promise.all([
      collectionToMap('clients'),
      collectionToMap('client_config'),
      collectionToMap('questions'),
      collectionToMap('users'),
      collectionToMap('batches'),
      collectionToMap('public_config'),
      collectionToMap('private_config')
    ]);
    
    console.log('[firebase-data] Loaded sizes:', {
      clients: Object.keys(clients).length,
      client_config: Object.keys(client_config).length,
      questions: Object.keys(questions).length,
      users: Object.keys(users).length,
      batches: Object.keys(batches).length,
      public_config: Object.keys(public_config).length,
      private_config: Object.keys(private_config).length,
    });

    await Promise.all(Object.keys(clients).map(async (cid) => attachClientSubcollections(cid, clients[cid])));

    submissions = await loadSubmissions();
    console.log('[firebase-data] Submissions clients:', Object.keys(submissions).length);
  } catch (e) {
    console.error('[firebase-data] Loading collections failed:', e);
    console.log('[firebase-data] Trying to load sample data as fallback...');
    
    // Fallback to sample data
    try {
      const response = await fetch('/data.json');
      if (!response.ok) {
        throw new Error('Failed to load sample data');
      }
      const sampleData = await response.json();
      console.log('[firebase-data] Loaded sample data successfully');
      return sampleData;
    } catch (fallbackError) {
      console.error('[firebase-data] Fallback also failed:', fallbackError);
      throw new Error(`Failed to load data from Firebase or fallback: ${e.message}`);
    }
  }

  const totalCounts =
    Object.keys(clients).length +
    Object.keys(client_config).length +
    Object.keys(questions).length +
    Object.keys(users).length +
    Object.keys(batches).length +
    Object.keys(public_config).length +
    Object.keys(private_config).length +
    Object.keys(submissions).length;
    
  if (totalCounts === 0) {
    console.log('[firebase-data] No data found in Firebase, trying sample data...');
    try {
      const response = await fetch('/data.json');
      if (!response.ok) {
        throw new Error('Failed to load sample data');
      }
      const sampleData = await response.json();
      console.log('[firebase-data] Loaded sample data successfully');
      return sampleData;
    } catch (fallbackError) {
      throw new Error('No data available from Firebase or fallback sources.');
    }
  }

  return {
    data: {
      __collections__: {
        clients,
        client_config,
        questions,
        submissions,
        users,
        batches,
        public_config,
        private_config
      }
    }
  };
}

export { db, auth };
