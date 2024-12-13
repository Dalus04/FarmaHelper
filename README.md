### FORMA DE TRABAJO: (arquitectura por capas)

---

```
/FarmaHelper
├── /client  # Código del frontend (React)
│   ├── /src
│   │   ├── /components  # Componentes de React
│   │   ├── /pages  # Páginas de la aplicación
│   │   ├── /services  # Servicios para interactuar con el backend
│   │   └── App.js
├── /server  # Código del backend (Node.js + NestJS)
│   ├── /src
│   │   ├── /controllers  # Controladores para manejar las rutas
│   │   ├── /models  # Modelos de datos
│   │   ├── /routes  # Rutas de la API
│   │   ├── /services  # Lógica de negocio
│   │   ├── /config  # Configuración (conexión a la base de datos, variables de entorno)
│   │   └── index.js  # Archivo principal del servidor
├── /database  # base de datos
│   ├── /src
│   │   └── /biblioteca_gdp.sql  # script de la base de datos
├── /recurses #recursos extras del proyecto
│   └── /src
└── README.md
```
