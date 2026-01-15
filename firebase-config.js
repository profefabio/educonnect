// ===================================================================
// CONFIGURACIÓN DE FIREBASE PARA EDUCONNECT
// ===================================================================
// 
// INSTRUCCIONES:
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un proyecto nuevo llamado "EduConnect"
// 3. Configura Firestore Database
// 4. Registra una app web
// 5. Copia TU configuración aquí abajo
// 
// ===================================================================

// ⚠️ REEMPLAZA ESTO CON TU CONFIGURACIÓN DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBZGOfbKdo6yO2j-8t_ueenZVPZgo8hnS4",
  authDomain: "educonnect-6d01c.firebaseapp.com",
  projectId: "educonnect-6d01c",
  storageBucket: "educonnect-6d01c.firebasestorage.app",
  messagingSenderId: "830589938307",
  appId: "1:830589938307:web:155bbfb23a5ba5d070c9b6"
};

// ===================================================================
// NO MODIFIQUES NADA DEBAJO DE ESTA LÍNEA
// ===================================================================

// Importar Firebase desde CDN (ya cargado en los HTML)
let db;
let firebaseInitialized = false;

// Función para inicializar Firebase
async function initializeFirebase() {
  if (firebaseInitialized) return;
  
  try {
    // Verificar que Firebase esté cargado
    if (typeof firebase === 'undefined') {
      console.error('Firebase no está cargado. Verifica los scripts en el HTML.');
      return false;
    }
    
    // Inicializar Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Obtener referencia a Firestore
    db = firebase.firestore();
    
    // Configurar ajustes de Firestore
    db.settings({
      cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    });
    
    // Habilitar persistencia offline
    try {
      await db.enablePersistence({ synchronizeTabs: true });
      console.log('Persistencia offline habilitada');
    } catch (err) {
      if (err.code === 'failed-precondition') {
        console.warn('Persistencia no disponible (múltiples tabs abiertos)');
      } else if (err.code === 'unimplemented') {
        console.warn('Persistencia no soportada en este navegador');
      }
    }
    
    firebaseInitialized = true;
    console.log('Firebase inicializado correctamente');
    return true;
    
  } catch (error) {
    console.error('Error al inicializar Firebase:', error);
    return false;
  }
}

// ===================================================================
// FUNCIONES HELPER PARA FIRESTORE
// ===================================================================

// Agregar documento a una colección
async function addDocument(collectionName, data) {
  try {
    const docRef = await db.collection(collectionName).add(data);
    console.log(`Documento agregado a ${collectionName}:`, docRef.id);
    return docRef.id;
  } catch (error) {
    console.error(`Error al agregar documento a ${collectionName}:`, error);
    throw error;
  }
}

// Obtener todos los documentos de una colección
async function getAllDocuments(collectionName) {
  try {
    const snapshot = await db.collection(collectionName).get();
    const documents = [];
    snapshot.forEach(doc => {
      documents.push({
        docId: doc.id,
        ...doc.data()
      });
    });
    console.log(`Obtenidos ${documents.length} documentos de ${collectionName}`);
    return documents;
  } catch (error) {
    console.error(`Error al obtener documentos de ${collectionName}:`, error);
    throw error;
  }
}

// Obtener documentos con filtro
async function getDocumentsWhere(collectionName, field, operator, value) {
  try {
    const snapshot = await db.collection(collectionName)
      .where(field, operator, value)
      .get();
    const documents = [];
    snapshot.forEach(doc => {
      documents.push({
        docId: doc.id,
        ...doc.data()
      });
    });
    console.log(`Obtenidos ${documents.length} documentos de ${collectionName} con filtro`);
    return documents;
  } catch (error) {
    console.error(`Error al filtrar documentos de ${collectionName}:`, error);
    throw error;
  }
}

// Actualizar documento
async function updateDocument(collectionName, docId, data) {
  try {
    await db.collection(collectionName).doc(docId).update(data);
    console.log(`Documento ${docId} actualizado en ${collectionName}`);
    return true;
  } catch (error) {
    console.error(`Error al actualizar documento en ${collectionName}:`, error);
    throw error;
  }
}

// Eliminar documento
async function deleteDocument(collectionName, docId) {
  try {
    await db.collection(collectionName).doc(docId).delete();
    console.log(`Documento ${docId} eliminado de ${collectionName}`);
    return true;
  } catch (error) {
    console.error(`Error al eliminar documento de ${collectionName}:`, error);
    throw error;
  }
}

// Escuchar cambios en tiempo real
function listenToCollection(collectionName, callback) {
  return db.collection(collectionName).onSnapshot(snapshot => {
    const documents = [];
    snapshot.forEach(doc => {
      documents.push({
        docId: doc.id,
        ...doc.data()
      });
    });
    callback(documents);
  }, error => {
    console.error(`Error al escuchar ${collectionName}:`, error);
  });
}

// ===================================================================
// MIGRACIÓN DE LOCALSTORAGE A FIREBASE (solo primera vez)
// ===================================================================

async function migrateFromLocalStorage() {
  try {
    const localData = localStorage.getItem('eduConnectData');
    if (!localData) {
      console.log('No hay datos en localStorage para migrar');
      return;
    }
    
    const data = JSON.parse(localData);
    
    // Verificar si ya hay datos en Firebase
    const existingInstitutions = await getAllDocuments('institutions');
    if (existingInstitutions.length > 0) {
      console.log('Ya hay datos en Firebase, no se migrará localStorage');
      return;
    }
    
    console.log('Migrando datos de localStorage a Firebase...');
    
    // Migrar instituciones
    if (data.institutions && data.institutions.length > 0) {
      for (const inst of data.institutions) {
        await addDocument('institutions', inst);
      }
      console.log(`✅ ${data.institutions.length} instituciones migradas`);
    }
    
    // Migrar docentes
    if (data.teachers && data.teachers.length > 0) {
      for (const teacher of data.teachers) {
        await addDocument('teachers', teacher);
      }
      console.log(`✅ ${data.teachers.length} docentes migrados`);
    }
    
    // Migrar estudiantes
    if (data.students && data.students.length > 0) {
      for (const student of data.students) {
        await addDocument('students', student);
      }
      console.log(`✅ ${data.students.length} estudiantes migrados`);
    }
    
    // Migrar posts
    if (data.posts && data.posts.length > 0) {
      for (const post of data.posts) {
        await addDocument('posts', post);
      }
      console.log(`✅ ${data.posts.length} publicaciones migradas`);
    }
    
    // Migrar logros
    if (data.achievements && data.achievements.length > 0) {
      for (const achievement of data.achievements) {
        await addDocument('achievements', achievement);
      }
      console.log(`✅ ${data.achievements.length} logros migrados`);
    }
    
    console.log('✅ Migración completada exitosamente');
    
    // Opcional: hacer backup del localStorage
    localStorage.setItem('eduConnectData_backup', localData);
    
  } catch (error) {
    console.error('Error durante la migración:', error);
  }
}

// ===================================================================
// EXPORTAR FUNCIONES (para uso en otros archivos)
// ===================================================================

window.firebaseConfig = {
  initializeFirebase,
  addDocument,
  getAllDocuments,
  getDocumentsWhere,
  updateDocument,
  deleteDocument,
  listenToCollection,
  migrateFromLocalStorage,
  getDb: () => db
};

// ===================================================================
// INICIALIZACIÓN AUTOMÁTICA
// ===================================================================

// Inicializar Firebase cuando se cargue el script
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Inicializando Firebase...');
  const initialized = await initializeFirebase();
  
  if (initialized) {
    console.log('✅ Firebase listo para usar');
    
    // Intentar migración automática (solo primera vez)
    // await migrateFromLocalStorage();
  } else {
    console.error('❌ Error al inicializar Firebase');
  }
});
