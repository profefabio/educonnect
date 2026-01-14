# 🎓 EduConnect - Plataforma de Gestión de Egresados

Plataforma web completa para la gestión de instituciones educativas, docentes y egresados con sistema de autenticación, dashboard de docentes y exportación de reportes.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Estructura de Archivos](#estructura-de-archivos)
- [Instalación Local](#instalación-local)
- [Despliegue en Internet](#despliegue-en-internet)
- [Uso de la Plataforma](#uso-de-la-plataforma)
- [Características Técnicas](#características-técnicas)

## ✨ Características

### Para Instituciones
- ✅ Registro completo con ubicación (País, Departamento, Municipio, Barrio)
- ✅ Gestión de información institucional
- ✅ Publicación de noticias y anuncios

### Para Docentes
- ✅ Registro vinculado a institución
- ✅ Dashboard completo con listado de estudiantes
- ✅ Filtros avanzados de búsqueda
- ✅ Exportación a Excel (.xlsx)
- ✅ Exportación a PDF con formato profesional
- ✅ Estadísticas en tiempo real

### Para Estudiantes/Egresados
- ✅ Registro con datos académicos
- ✅ Año de graduación
- ✅ Disponibilidad para eventos
- ✅ Registro de logros

### General
- ✅ Sistema de autenticación seguro
- ✅ Almacenamiento local (localStorage)
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Interfaz moderna y profesional
- ✅ Sin necesidad de base de datos externa

## 📁 Estructura de Archivos

```
educonnect/
├── index.html                 # Página de bienvenida (landing page)
├── educonnect-auth.html       # Sistema de login/registro
├── teacher-dashboard.html     # Dashboard para docentes
├── alumni-platform.html       # Plataforma completa de egresados
├── README.md                  # Este archivo
└── .gitignore                 # Archivos a ignorar en Git
```

## 💻 Instalación Local

### Opción 1: Abrir Directamente
1. Descarga todos los archivos HTML
2. Abre `index.html` en tu navegador web
3. ¡Listo! La aplicación funcionará completamente

### Opción 2: Servidor Local Simple

**Con Python (recomendado):**
```bash
# Python 3
python -m http.server 8000

# Luego abre en el navegador:
# http://localhost:8000
```

**Con Node.js:**
```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar servidor
http-server -p 8000

# Abrir: http://localhost:8000
```

**Con PHP:**
```bash
php -S localhost:8000
```

## 🌐 Despliegue en Internet

### Opción 1: GitHub Pages (GRATIS - Recomendado)

**Pasos:**

1. **Crear cuenta en GitHub** (si no tienes una)
   - Ve a https://github.com
   - Haz clic en "Sign up"

2. **Crear un nuevo repositorio**
   - Haz clic en el botón "+" → "New repository"
   - Nombre: `educonnect` (o el que prefieras)
   - Público o Privado (ambos funcionan)
   - Clic en "Create repository"

3. **Subir archivos**
   - Opción A (Web): Arrastra los archivos HTML al repositorio
   - Opción B (Git):
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/TU-USUARIO/educonnect.git
     git push -u origin main
     ```

4. **Activar GitHub Pages**
   - Ve a "Settings" del repositorio
   - En el menú lateral, clic en "Pages"
   - En "Source", selecciona "main" branch
   - Clic en "Save"
   - Tu sitio estará en: `https://TU-USUARIO.github.io/educonnect/`

**Ventajas:**
- ✅ 100% Gratis
- ✅ HTTPS automático
- ✅ Sin límite de visitas
- ✅ Actualización fácil

---

### Opción 2: Netlify (GRATIS)

**Pasos:**

1. **Crear cuenta** en https://www.netlify.com

2. **Método A - Arrastrar y soltar:**
   - Ve a https://app.netlify.com/drop
   - Arrastra la carpeta con todos los archivos HTML
   - ¡Listo! Tu sitio estará en línea

3. **Método B - Desde Git:**
   - Conecta tu repositorio de GitHub
   - Netlify desplegará automáticamente

**Ventajas:**
- ✅ Gratis hasta 100GB/mes
- ✅ Deploy en segundos
- ✅ HTTPS automático
- ✅ Dominio personalizado gratis
- ✅ Actualizaciones automáticas desde Git

---

### Opción 3: Vercel (GRATIS)

**Pasos:**

1. **Crear cuenta** en https://vercel.com

2. **Importar proyecto:**
   - Clic en "New Project"
   - Conecta con GitHub o sube archivos
   - Clic en "Deploy"

**Ventajas:**
- ✅ Gratis para proyectos personales
- ✅ Deploy instantáneo
- ✅ HTTPS automático
- ✅ Dominio personalizado

---

### Opción 4: Firebase Hosting (GRATIS)

**Pasos:**

1. **Instalar Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Inicializar proyecto:**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Desplegar:**
   ```bash
   firebase deploy
   ```

**Ventajas:**
- ✅ Gratis hasta 10GB almacenamiento
- ✅ CDN global
- ✅ HTTPS automático

---

### Opción 5: Hosting Tradicional

**Proveedores recomendados:**
- **InfinityFree**: Hosting gratis con PHP
- **000webhost**: Hosting gratis
- **Hostinger**: Desde $2.99/mes
- **SiteGround**: Desde $3.99/mes

**Pasos generales:**
1. Contratar hosting
2. Subir archivos vía FTP (usar FileZilla)
3. Tu sitio estará en tu dominio

---

## 🚀 Comparación de Opciones

| Opción | Costo | Facilidad | Velocidad | HTTPS |
|--------|-------|-----------|-----------|-------|
| GitHub Pages | Gratis | ⭐⭐⭐⭐⭐ | Rápida | ✅ |
| Netlify | Gratis | ⭐⭐⭐⭐⭐ | Muy Rápida | ✅ |
| Vercel | Gratis | ⭐⭐⭐⭐⭐ | Muy Rápida | ✅ |
| Firebase | Gratis | ⭐⭐⭐⭐ | Muy Rápida | ✅ |
| Hosting Tradicional | $$ | ⭐⭐⭐ | Variable | Depende |

**Recomendación:** Netlify o GitHub Pages para comenzar.

---

## 📖 Uso de la Plataforma

### Flujo de Trabajo

1. **Página de Bienvenida (index.html)**
   - Landing page con información
   - Botón "Comenzar Ahora" → va a login

2. **Sistema de Autenticación (educonnect-auth.html)**
   - 3 tipos de usuarios: Institución, Docente, Estudiante
   - Cada uno con formulario específico
   - Toggle entre Registro e Inicio de Sesión

3. **Dashboard Docente (teacher-dashboard.html)**
   - Vista completa de estudiantes
   - Filtros avanzados
   - Exportación a Excel y PDF

4. **Plataforma de Egresados (alumni-platform.html)**
   - Dashboard principal
   - Gestión de instituciones
   - Gestión de egresados
   - Blog de noticias
   - Seguimiento y logros

### Datos de Prueba

Para probar rápidamente, el sistema incluye datos de demostración:
- 10 estudiantes de ejemplo
- Diferentes años de graduación
- Varias carreras
- Disponibilidades variadas

---

## 🛠️ Características Técnicas

### Tecnologías Utilizadas
- **HTML5**: Estructura semántica
- **CSS3**: Diseño moderno con gradientes y animaciones
- **JavaScript (Vanilla)**: Sin frameworks, 100% nativo
- **localStorage**: Persistencia de datos en el navegador
- **jsPDF + autoTable**: Generación de PDFs
- **SheetJS (xlsx)**: Generación de archivos Excel

### Fuentes
- **Outfit**: Tipografía principal (Google Fonts)
- **Crimson Pro**: Títulos elegantes (Google Fonts)

### Librerías CDN Utilizadas
```html
<!-- PDF -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>

<!-- Excel -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

<!-- Fuentes -->
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Crimson+Pro:wght@400;600;700&display=swap" rel="stylesheet">
```

### Navegadores Compatibles
- ✅ Chrome (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Edge (90+)
- ✅ Opera (76+)

### Dispositivos Compatibles
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px - 1920px)
- ✅ Tablet (768px - 1024px)
- ✅ Móvil (320px - 768px)

---

## 🔒 Seguridad y Privacidad

- Los datos se almacenan **localmente** en el navegador del usuario
- No hay conexión a servidores externos (excepto CDNs de librerías)
- Los datos no se comparten ni se envían a ningún lugar
- Las contraseñas se almacenan en texto plano en localStorage (considera implementar hash para producción)

---

## 🎨 Personalización

### Cambiar Colores

En cada archivo HTML, busca la sección `:root` en el CSS:

```css
:root {
    --primary: #1a1a2e;        /* Color principal */
    --accent: #0f4c75;         /* Color de acento */
    --light-accent: #3282b8;   /* Acento claro */
    /* ... más colores ... */
}
```

### Cambiar Fuentes

Reemplaza en el `<link>` del `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=TU-FUENTE&display=swap" rel="stylesheet">
```

Y actualiza en CSS:
```css
body {
    font-family: 'TU-FUENTE', sans-serif;
}
```

---

## 📝 Notas Importantes

1. **localStorage tiene límite de ~5-10MB** por dominio
2. Los datos se borran si el usuario limpia el caché del navegador
3. Para producción real, considera:
   - Implementar una base de datos (Firebase, MongoDB, etc.)
   - Sistema de autenticación robusto (JWT, OAuth)
   - Hash de contraseñas (bcrypt)
   - Backend con Node.js, Python, PHP, etc.

---

## 🐛 Solución de Problemas

### Los datos no se guardan
- Verifica que JavaScript esté habilitado
- Revisa la consola del navegador (F12)
- Asegúrate de no estar en modo incógnito

### Los PDFs no se generan
- Verifica conexión a internet (se necesita para cargar jsPDF)
- Revisa que el CDN esté disponible

### Los archivos Excel no se descargan
- Verifica conexión a internet (CDN de SheetJS)
- Prueba en otro navegador

---

## 📞 Soporte

Para reportar problemas o sugerencias:
1. Revisa este README completo
2. Verifica la consola del navegador (F12) para errores
3. Asegúrate de tener conexión a internet para los CDNs

---

## 📄 Licencia

Este proyecto es de código abierto y puede ser usado libremente para propósitos educativos y comerciales.

---

## 🎉 ¡Listo para Despegar!

Tu plataforma está **100% lista** para ser desplegada en internet. Sigue las instrucciones de la opción que prefieras y en minutos tendrás tu sitio en línea.

**Recomendación rápida:**
1. Ve a https://app.netlify.com/drop
2. Arrastra todos los archivos HTML
3. ¡Tu sitio estará en línea en segundos!

---

**Desarrollado con 💙 para conectar comunidades educativas**
