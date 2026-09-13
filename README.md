# LIFE

Panel personal (calendario, tareas, rutinas, nutrición). Un solo usuario. React + Vite + TypeScript + Tailwind, con Firebase (Auth + Firestore) para poder usarlo desde el celu y la notebook con los mismos datos, desplegado en GitHub Pages.

## 1. Configurar Firebase (una sola vez)

1. Andá a [console.firebase.google.com](https://console.firebase.google.com) y creá un proyecto nuevo (plan gratuito "Spark" alcanza).
2. Dentro del proyecto, agregá una **Web app** (ícono `</>`). Te va a dar un objeto de configuración con `apiKey`, `authDomain`, etc. — copialos, los vas a necesitar en el paso 3.
3. Copiá `.env.example` a `.env` y completá los valores:
   ```
   cp .env.example .env
   ```
4. En el menú lateral, andá a **Authentication → Sign-in method** y activá **Email/Password**.
5. En **Authentication → Users**, agregá manualmente tu único usuario (tu email + una contraseña). No hace falta ni va a haber pantalla de registro en la app — el login es solo para vos.
6. Copiá el **UID** de ese usuario (aparece en la lista de Users).
7. Andá a **Firestore Database** y creá la base (modo producción, elegí una región cercana).
8. En **Firestore → Reglas**, reemplazá el contenido por esto (reemplazando `TU_UID_ACA` por el UID del paso 6):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == "TU_UID_ACA";
       }
     }
   }
   ```

**Nota de seguridad:** las claves en `.env` (`apiKey`, etc.) **no son secretas** — identifican el proyecto, no autorizan acceso, y van a terminar visibles en el bundle público de JS de todos modos (así funciona cualquier app web con Firebase). Lo que realmente protege tus datos son las **reglas de Firestore** del paso 8. Por eso `.env` está en `.gitignore` (por prolijidad, no por seguridad), pero aunque esas claves quedaran expuestas no importa mientras las reglas estén bien configuradas.

## 2. Desarrollo local

```
npm install
npm run dev
```

## 3. Deploy a GitHub Pages

1. Creá un repo en GitHub llamado `life` (el `base` en `vite.config.ts` ya está configurado como `/life/`; si usás otro nombre, actualizalo ahí).
2. Conectá este proyecto al repo y hacé push.
3. Deploy:
   ```
   npm run deploy
   ```
   Esto compila y publica la carpeta `dist` en la rama `gh-pages`.
4. En GitHub, andá a **Settings → Pages** y configurá la fuente como la rama `gh-pages`.
5. Tu app va a quedar en `https://<tu-usuario>.github.io/life/`.

Para "instalarla" en el celu: abrí esa URL en Chrome/Safari y usá la opción "Agregar a pantalla de inicio".
