// ===================================================================
// FIREBASE INTEGRATION FOR EDUCONNECT
// Archivo: firebase-integration.js
// ===================================================================

(function() {
    'use strict';
    
    console.log('🔥 Cargando Firebase Integration...');
    
    let firebaseReady = false;
    
    // Esperar a que Firebase y firebaseConfig estén disponibles
    async function waitForFirebase() {
        return new Promise((resolve) => {
            const check = () => {
                if (window.firebaseConfig && window.appData) {
                    resolve(true);
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }
    
    // Inicializar Firebase y cargar datos
    async function initialize() {
        try {
            await waitForFirebase();
            console.log('✅ Firebase config detectado');
            
            const initialized = await window.firebaseConfig.initializeFirebase();
            if (!initialized) {
                console.error('❌ Error inicializando Firebase');
                return false;
            }
            
            console.log('✅ Firebase inicializado correctamente');
            firebaseReady = true;
            
            // Cargar datos desde Firebase
            await loadAllFromFirebase();
            
            return true;
        } catch (error) {
            console.error('Error en initialize:', error);
            return false;
        }
    }
    
    // Cargar todos los datos desde Firebase
    async function loadAllFromFirebase() {
        try {
            console.log('🔄 Cargando datos desde Firebase...');
            
            const [institutions, teachers, students, posts, achievements] = await Promise.all([
                window.firebaseConfig.getAllDocuments('institutions'),
                window.firebaseConfig.getAllDocuments('teachers'),
                window.firebaseConfig.getAllDocuments('students'),
                window.firebaseConfig.getAllDocuments('posts'),
                window.firebaseConfig.getAllDocuments('achievements')
            ]);
            
            // Actualizar appData
            if (window.appData) {
                window.appData.institutions = institutions;
                window.appData.teachers = teachers;
                window.appData.students = students;
                window.appData.posts = posts || [];
                window.appData.achievements = achievements || [];
                
                console.log('✅ Datos cargados desde Firebase:');
                console.log(`  📊 Instituciones: ${institutions.length}`);
                console.log(`  👨‍🏫 Docentes: ${teachers.length}`);
                console.log(`  🎓 Estudiantes: ${students.length}`);
                console.log(`  📰 Posts: ${(posts || []).length}`);
                console.log(`  🏆 Logros: ${(achievements || []).length}`);
            }
            
            return true;
        } catch (error) {
            console.error('Error cargando desde Firebase:', error);
            return false;
        }
    }
    
    // API pública
    window.FirebaseIntegration = {
        
        // Guardar en Firebase
        save: async function(collection, data) {
            if (!firebaseReady) {
                console.warn('Firebase no listo, guardando solo en localStorage');
                return null;
            }
            
            try {
                const docId = await window.firebaseConfig.addDocument(collection, data);
                console.log(`✅ Guardado en Firebase (${collection}):`, docId);
                
                // También guardar en localStorage como backup
                localStorage.setItem('eduConnectData', JSON.stringify(window.appData));
                
                return docId;
            } catch (error) {
                console.error(`Error guardando en ${collection}:`, error);
                throw error;
            }
        },
        
        // Actualizar en Firebase
        update: async function(collection, id, data) {
            if (!firebaseReady) {
                console.warn('Firebase no listo');
                return false;
            }
            
            try {
                const docs = await window.firebaseConfig.getDocumentsWhere(collection, 'id', '==', id);
                if (docs.length > 0) {
                    await window.firebaseConfig.updateDocument(collection, docs[0].docId, data);
                    console.log(`✅ Actualizado en Firebase (${collection}):`, id);
                    
                    // Backup en localStorage
                    localStorage.setItem('eduConnectData', JSON.stringify(window.appData));
                    
                    return true;
                }
                return false;
            } catch (error) {
                console.error(`Error actualizando ${collection}:`, error);
                return false;
            }
        },
        
        // Eliminar de Firebase
        delete: async function(collection, id) {
            if (!firebaseReady) {
                console.warn('Firebase no listo');
                return false;
            }
            
            try {
                const docs = await window.firebaseConfig.getDocumentsWhere(collection, 'id', '==', id);
                if (docs.length > 0) {
                    await window.firebaseConfig.deleteDocument(collection, docs[0].docId);
                    console.log(`✅ Eliminado de Firebase (${collection}):`, id);
                    
                    // Backup en localStorage
                    localStorage.setItem('eduConnectData', JSON.stringify(window.appData));
                    
                    return true;
                }
                return false;
            } catch (error) {
                console.error(`Error eliminando de ${collection}:`, error);
                return false;
            }
        },
        
        // Cargar todo desde Firebase
        loadAll: loadAllFromFirebase,
        
        // Verificar si Firebase está listo
        isReady: function() {
            return firebaseReady;
        }
    };
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    console.log('✅ Firebase Integration cargado');
    
})();
