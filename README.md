# Hackathon Virtual — Universidad del Rosario

Proyecto: formulario de inscripción y selección de repositorios GitHub para el Hackathon Virtual.

## Descripción

Aplicación Angular que permite a participantes completar un formulario, buscar repositorios públicos de GitHub y seleccionar hasta 2 para su postulación. Incluye validaciones de formulario, accesibilidad básica (ARIA, navegación por teclado) y theming con variables SCSS.

## Requisitos

- Node.js 24.0.0
- npm 8+ (o yarn)
- Angular CLI (opcional para dev): `npm install -g @angular/cli`

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

```bash
npm install
```

## Desarrollo (ejecutar localmente)

Para iniciar la app en modo desarrollo (si el puerto 4200 está ocupado usa otro puerto):

```bash
ng serve --port 4200
# o
npm start
```

Abrir: http://localhost:4200/ (o el puerto que uses)

## Notas técnicas rápidas

- SCSS: las variables globales están en `src/assets/styles/_variables.scss` y la ruta está añadida en `angular.json` (`stylePreprocessorOptions.includePaths`) para poder usar `@import 'variables';` desde cualquier archivo SCSS de componentes.
- Validaciones importantes:
  - `fechaNacimiento` tiene validación de fecha máxima (no futura) y límite de edad (menor de 30 años).
  - Inputs usan validadores reactivos (formGroup + Validators).
- Angular Material: componentes como `mat-card`, `mat-checkbox`, `mat-icon`, `mat-datepicker`, etc. están importados en `AppModule`.

## Accesibilidad (WCAG / keyboard)

Se implementaron varias mejoras básicas:

- Navegación por teclado: filas focuseables (`tabindex`, `role="button"`) y manejadores `keydown` para Enter/Space.
- Estados de validación expuestos con `aria-invalid` y mensajes de error con `role="alert"` / `aria-live="assertive"`.
- Estilos visibles para foco (`:focus-visible`) en `src/styles.scss`.

Recomendaciones para evaluación WCAG 2.1 AA:

- Ejecutar auditoría Lighthouse y axe (o pa11y).
- Probar con lector de pantalla (NVDA/VoiceOver) y navegación solo con teclado.
- Verificar contraste de colores en pantallas reales.

## Tests manuales sugeridos

- Tab/Shift+Tab atraviesa todos los controles en orden lógico.
- Enter en el input de GitHub dispara la búsqueda.
- Intentar ingresar fecha futura en el `mat-datepicker` — debe estar bloqueada.

## Estructura relevante

- `src/app/components` — componentes principales (`inscription-form`, `github-repos`, `disclaimer`)
- `src/assets/styles/_variables.scss` — variables de diseño y colores segun el manual de marca
- `src/styles.scss` — estilos globales, theming de Material
