// ===================================================================
// FIREBASE INTEGRATION FOR EDUCONNECT
// Archivo: firebase-integration.js
// ===================================================================

(function() {
    'use strict';
    
    console.log('🔥 Cargando Firebase Integration...');
    
    let firebaseReady = false;
    
    // Verificar si Firebase ya está inicializado
    function checkFirebaseReady() {
        return window.firebaseConfig && 
               typeof window.firebaseConfig.getDb === 'function' && 
               window.firebaseConfig.getDb() !== undefined;
    }
    
    // Esperar a que Firebase esté completamente listo
    async function waitForFirebaseReady() {
        console.log('⏳ Esperando a que Firebase esté listo...');
        
        let attempts = 0;
        while (!checkFirebaseReady() && attempts < 100) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (checkFirebaseReady()) {
            firebaseReady = true;
            console.log('✅ Firebase está completamente listo y operativo');
            return true;
        } else {
            console.error('❌ Timeout esperando a que Firebase esté listo');
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
            // Si firebaseReady aún no está en true, verificar ahora
            if (!firebaseReady) {
                const isReady = await waitForFirebaseReady();
                if (!isReady) {
                    console.warn('⏳ Firebase no disponible. Guardando solo en localStorage.');
                    localStorage.setItem('eduConnectData', JSON.stringify(window.appData));
                    return null;
                }
            }
            
            try {
                const docId = await window.firebaseConfig.addDocument(collection, data);
                console.log(`✅ Guardado en Firebase (${collection}):`, docId);
                
                // También guardar en localStorage como backup
                localStorage.setItem('eduConnectData', JSON.stringify(window.appData));
                
                return docId;
            } catch (error) {
                console.error(`❌ Error guardando en ${collection}:`, error);
                // Guardar al menos en localStorage
                localStorage.setItem('eduConnectData', JSON.stringify(window.appData));
                return null;
            }
        },
        
        // Actualizar en Firebase
        update: async function(collection, id, data) {
            if (!firebaseReady) {
                const isReady = await waitForFirebaseReady();
                if (!isReady) {
                    console.warn('⏳ Firebase no disponible');
                    return false;
                }
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
                console.error(`❌ Error actualizando ${collection}:`, error);
                return false;
            }
        },
        
        // Eliminar de Firebase
        delete: async function(collection, id) {
            if (!firebaseReady) {
                const isReady = await waitForFirebaseReady();
                if (!isReady) {
                    console.warn('⏳ Firebase no disponible');
                    return false;
                }
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
                console.error(`❌ Error eliminando de ${collection}:`, error);
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
    async function init() {
        const ready = await waitForFirebaseReady();
        if (ready) {
            await loadAllFromFirebase();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 1500); // Esperar 1.5 segundos
        });
    } else {
        setTimeout(init, 1500);
    }
    
    console.log('✅ Firebase Integration cargado');
    
})();
