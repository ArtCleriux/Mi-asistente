# Mi Asistente 🚀

Una aplicación de productividad personal construida con **React** que combina un **Tablero Kanban** con un **Temporizador Pomodoro**. La autenticación y la persistencia de datos se manejan con **Firebase (Auth y Firestore)**, y el estilo se gestiona con **Tailwind CSS**.

## ✨ Características Principales

* **Autenticación de Usuario:** Registro e inicio de sesión seguro usando Firebase Authentication.
* **Tablero Kanban:** Gestiona tareas en tres estados (Por Hacer, En Progreso, Hecho).
* **Drag and Drop:** Mueve tareas de una columna a otra con la funcionalidad de arrastrar y soltar (gracias a `dnd-kit`).
* **Persistencia de Datos:** Las tareas se guardan y sincronizan en tiempo real con Firestore, específicas para cada usuario.
* **Temporizador Pomodoro:** Un cronómetro para aplicar la técnica Pomodoro (25 min trabajo, 5 min descanso corto, 15 min descanso largo).

## 💻 Instalación y Configuración

Sigue estos pasos para configurar y ejecutar la aplicación localmente.

### Requisitos

* Node.js (versión recomendada por `package.json`: `>14.0.0`)
* Una cuenta de Firebase

### Pasos

1.  **Clonar el repositorio:**
    ```bash
    git clone [URL_DE_TU_REPOSITORIO]
    cd mi-asistente
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Firebase:**
    La aplicación utiliza variables de entorno para la configuración de Firebase. Crea un archivo llamado **`.env.local`** en la raíz del proyecto y añade tu configuración de Firebase:

    ```env
    # .env.local

    REACT_APP_FIREBASE_API_KEY="AIzaSy... "
    REACT_APP_FIREBASE_AUTH_DOMAIN="mi-asistente.firebaseapp.com"
    REACT_APP_FIREBASE_PROJECT_ID="mi-asistente"
    REACT_APP_FIREBASE_STORAGE_BUCKET="mi-asistente.appspot.com"
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID="1234567890"
    REACT_APP_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"
    # Opcional: si usas Google Analytics
    # REACT_APP_FIREBASE_MEASUREMENT_ID="G-ABCDEF1234"
    ```
    *Asegúrate de configurar **Firestore** y **Firebase Authentication** en tu consola de Firebase.*

4.  **Ejecutar la aplicación:**
    ```bash
    npm start
    ```
    La aplicación se abrirá en `http://localhost:3000`.

## ⚙️ Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

| Comando | Descripción |
| :--- | :--- |
| `npm start` | Ejecuta la aplicación en modo desarrollo. |
| `npm run build` | Compila la aplicación para producción en la carpeta `build`. |
| `npm test` | Lanza el *test runner* en el modo interactivo. |
| `npm run eject` | Expulsa la configuración oculta de `react-scripts`. |