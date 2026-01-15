// Firebase Storage Integration para Multimedia
// Este archivo maneja la subida de imágenes, videos y archivos a Firebase Storage

class FirebaseStorageManager {
    constructor() {
        this.storage = null;
        this.maxImageSize = 5 * 1024 * 1024; // 5MB
        this.maxVideoSize = 50 * 1024 * 1024; // 50MB
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
    }

    // Inicializar Firebase Storage
    async initialize() {
        try {
            // Esperar a que Firebase esté listo
            await new Promise((resolve) => {
                const checkFirebase = setInterval(() => {
                    if (window.firebase && window.firebase.storage) {
                        clearInterval(checkFirebase);
                        resolve();
                    }
                }, 100);
            });

            this.storage = window.firebase.storage();
            console.log('✅ Firebase Storage inicializado');
            return true;
        } catch (error) {
            console.error('❌ Error inicializando Firebase Storage:', error);
            return false;
        }
    }

    // Convertir base64 a Blob
    base64ToBlob(base64Data, contentType = '') {
        const byteString = atob(base64Data.split(',')[1]);
        const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: contentType || mimeString });
    }

    // Generar nombre único para archivo
    generateUniqueFileName(originalName) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const extension = originalName.split('.').pop();
        const nameWithoutExt = originalName.split('.').slice(0, -1).join('.');
        return `${nameWithoutExt}_${timestamp}_${random}.${extension}`;
    }

    // Subir imagen a Firebase Storage
    async uploadImage(imageData, imageName, postId) {
        try {
            console.log(`📤 Subiendo imagen: ${imageName}`);

            // Verificar tamaño
            const blob = this.base64ToBlob(imageData);
            if (blob.size > this.maxImageSize) {
                throw new Error(`Imagen ${imageName} excede 5MB`);
            }

            // Generar ruta única
            const uniqueName = this.generateUniqueFileName(imageName);
            const path = `posts/${postId}/images/${uniqueName}`;

            // Subir a Storage
            const storageRef = this.storage.ref(path);
            const snapshot = await storageRef.put(blob);

            // Obtener URL de descarga
            const downloadURL = await snapshot.ref.getDownloadURL();

            console.log(`✅ Imagen subida: ${imageName}`);

            return {
                name: imageName,
                path: path,
                url: downloadURL,
                size: blob.size,
                type: blob.type
            };
        } catch (error) {
            console.error(`❌ Error subiendo imagen ${imageName}:`, error);
            throw error;
        }
    }

    // Subir video a Firebase Storage
    async uploadVideo(videoData, videoName, postId) {
        try {
            console.log(`📤 Subiendo video: ${videoName}`);

            // Verificar tamaño
            const blob = this.base64ToBlob(videoData);
            if (blob.size > this.maxVideoSize) {
                throw new Error(`Video ${videoName} excede 50MB`);
            }

            // Generar ruta única
            const uniqueName = this.generateUniqueFileName(videoName);
            const path = `posts/${postId}/videos/${uniqueName}`;

            // Subir a Storage con metadata
            const storageRef = this.storage.ref(path);
            const metadata = {
                contentType: blob.type,
                customMetadata: {
                    'originalName': videoName
                }
            };

            const snapshot = await storageRef.put(blob, metadata);

            // Obtener URL de descarga
            const downloadURL = await snapshot.ref.getDownloadURL();

            console.log(`✅ Video subido: ${videoName}`);

            return {
                name: videoName,
                path: path,
                url: downloadURL,
                size: blob.size,
                type: blob.type
            };
        } catch (error) {
            console.error(`❌ Error subiendo video ${videoName}:`, error);
            throw error;
        }
    }

    // Subir archivo (PDF, Word, etc) a Firebase Storage
    async uploadFile(fileData, fileName, postId) {
        try {
            console.log(`📤 Subiendo archivo: ${fileName}`);

            // Verificar tamaño
            const blob = this.base64ToBlob(fileData);
            if (blob.size > this.maxFileSize) {
                throw new Error(`Archivo ${fileName} excede 10MB`);
            }

            // Generar ruta única
            const uniqueName = this.generateUniqueFileName(fileName);
            const path = `posts/${postId}/files/${uniqueName}`;

            // Subir a Storage
            const storageRef = this.storage.ref(path);
            const metadata = {
                contentType: blob.type,
                customMetadata: {
                    'originalName': fileName
                }
            };

            const snapshot = await storageRef.put(blob, metadata);

            // Obtener URL de descarga
            const downloadURL = await snapshot.ref.getDownloadURL();

            console.log(`✅ Archivo subido: ${fileName}`);

            return {
                name: fileName,
                path: path,
                url: downloadURL,
                size: blob.size,
                type: blob.type
            };
        } catch (error) {
            console.error(`❌ Error subiendo archivo ${fileName}:`, error);
            throw error;
        }
    }

    // Subir todos los archivos multimedia de un post
    async uploadPostMedia(postId, selectedMediaFiles, onProgress) {
        try {
            console.log('📤 Subiendo multimedia del post...');

            const uploadedMedia = {
                images: [],
                video: null,
                files: []
            };

            let totalFiles = selectedMediaFiles.images.length + 
                           (selectedMediaFiles.video ? 1 : 0) + 
                           selectedMediaFiles.files.length;
            let uploadedCount = 0;

            // Subir imágenes
            for (const image of selectedMediaFiles.images) {
                const uploadedImage = await this.uploadImage(image.data, image.name, postId);
                uploadedMedia.images.push(uploadedImage);
                uploadedCount++;
                if (onProgress) {
                    onProgress(uploadedCount, totalFiles, `Imagen ${uploadedCount}/${totalFiles}`);
                }
            }

            // Subir video
            if (selectedMediaFiles.video) {
                const uploadedVideo = await this.uploadVideo(
                    selectedMediaFiles.video.data, 
                    selectedMediaFiles.video.name, 
                    postId
                );
                uploadedMedia.video = uploadedVideo;
                uploadedCount++;
                if (onProgress) {
                    onProgress(uploadedCount, totalFiles, 'Video');
                }
            }

            // Subir archivos
            for (const file of selectedMediaFiles.files) {
                const uploadedFile = await this.uploadFile(file.data, file.name, postId);
                uploadedMedia.files.push(uploadedFile);
                uploadedCount++;
                if (onProgress) {
                    onProgress(uploadedCount, totalFiles, `Archivo ${uploadedCount}/${totalFiles}`);
                }
            }

            console.log('✅ Toda la multimedia subida exitosamente');
            return uploadedMedia;

        } catch (error) {
            console.error('❌ Error subiendo multimedia:', error);
            throw error;
        }
    }

    // Eliminar archivo de Storage
    async deleteFile(filePath) {
        try {
            console.log(`🗑️ Eliminando archivo: ${filePath}`);
            const storageRef = this.storage.ref(filePath);
            await storageRef.delete();
            console.log(`✅ Archivo eliminado: ${filePath}`);
            return true;
        } catch (error) {
            console.error(`❌ Error eliminando archivo ${filePath}:`, error);
            return false;
        }
    }

    // Eliminar toda la multimedia de un post
    async deletePostMedia(media) {
        try {
            console.log('🗑️ Eliminando multimedia del post...');

            const deletePromises = [];

            // Eliminar imágenes
            if (media.images) {
                for (const image of media.images) {
                    if (image.path) {
                        deletePromises.push(this.deleteFile(image.path));
                    }
                }
            }

            // Eliminar video
            if (media.video && media.video.path) {
                deletePromises.push(this.deleteFile(media.video.path));
            }

            // Eliminar archivos
            if (media.files) {
                for (const file of media.files) {
                    if (file.path) {
                        deletePromises.push(this.deleteFile(file.path));
                    }
                }
            }

            await Promise.all(deletePromises);
            console.log('✅ Multimedia del post eliminada');
            return true;

        } catch (error) {
            console.error('❌ Error eliminando multimedia:', error);
            return false;
        }
    }
}

// Crear instancia global
window.firebaseStorageManager = new FirebaseStorageManager();

// Inicializar cuando Firebase esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔄 Inicializando Firebase Storage Manager...');
    await window.firebaseStorageManager.initialize();
});

console.log('✅ Firebase Storage Manager cargado');
