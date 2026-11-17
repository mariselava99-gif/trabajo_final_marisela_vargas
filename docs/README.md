# Aplicación Web SIG – Visualización de los Municipios de Boyacá

## 1. Descripción general

Aplicación web geográfica interactiva desarrollada con Leaflet.js y GeoServer para la visualización y consulta de los municipios del departamento de Boyacá, mediante la implementación de servicios web geográficos bajo los estándares OGC WMS y WFS.

La aplicación permite visualizar información espacial, consultar atributos geográficos, realizar búsquedas por nombre de municipio e interactuar con las entidades representadas en el mapa.

## 2. Objetivo

Implementar una aplicación web SIG que permita consumir servicios geográficos publicados en GeoServer, integrando información espacial mediante servicios WMS y WFS para facilitar la consulta y visualización de los municipios de Boyacá.

## 3. Características principales

- Visualización geográfica de los municipios de Boyacá.
- Consumo de servicios WMS de GeoServer.
- Consumo de servicios WFS mediante datos GeoJSON.
- Visualización de mapas base OpenStreetMap y Satélite.
- Búsqueda de municipios por nombre.
- Consulta de atributos geográficos mediante ventanas emergentes (popups).
- Resaltado de entidades al pasar el cursor.
- Selección y acercamiento a los municipios.
- Panel de información geográfica.
- Control de capas y escala cartográfica.
- Leyenda cartográfica.
- Diseño adaptable a computadores y dispositivos móviles.

## 4. Tecnologías utilizadas

| Tecnología | Aplicación |
|---|---|
| HTML5 | Estructura de la aplicación |
| CSS3 | Diseño y adaptación responsive |
| JavaScript ES6 | Funcionalidad e interactividad |
| Leaflet.js 1.9.4 | Visualización cartográfica |
| GeoServer | Publicación de servicios geográficos |
| WMS | Visualización de información geográfica |
| WFS | Consulta y descarga de entidades geográficas |
| GeoJSON | Representación de datos espaciales |
| PostgreSQL/PostGIS | Almacenamiento de información geográfica |
| GitHub Pages | Publicación de la aplicación web |

## 5. Configuración de GeoServer

La aplicación consume una capa geográfica publicada en GeoServer con la siguiente configuración:

- **Workspace:** `boyaca`
- **Nombre de la capa:** `municipios_boyaca`
- **Nombre completo:** `boyaca:municipios_boyaca`

### Servicios geográficos

**Servicio WMS:**

`http://localhost:8080/geoserver/boyaca/wms`

**Servicio WFS:**

`http://localhost:8080/geoserver/boyaca/wfs`

Estos servicios se encuentran configurados para ejecución local.

## 6. Estructura de archivos

```text
webapp/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

La carpeta `docs/` contiene una copia de los archivos de la aplicación utilizada para su publicación mediante GitHub Pages.

## 7. Instalación y ejecución local

### Requisitos previos

- Python instalado.
- Docker Desktop en ejecución.
- GeoServer activo.
- Capa `boyaca:municipios_boyaca` publicada y habilitada.

### Pasos para ejecutar la aplicación

1. Iniciar Docker Desktop y verificar que el contenedor de GeoServer esté activo.
2. Confirmar que GeoServer se encuentre disponible en:

   `http://localhost:8080/geoserver/web`

3. Abrir una terminal en la carpeta `webapp`.
4. Ejecutar el siguiente comando:

```powershell
py -m http.server 8000
```

5. Abrir el navegador e ingresar a:

   `http://localhost:8000/index.html`

**Importante:** mantener abierta la terminal mientras se utiliza la aplicación.

## 8. Pruebas de funcionamiento

Durante la implementación se realizaron las siguientes pruebas:

- Verificación del acceso a GeoServer.
- Consulta de capacidades del servicio WMS.
- Consulta de capacidades del servicio WFS.
- Obtención de entidades geográficas en formato GeoJSON.
- Visualización de los municipios mediante WMS y WFS.
- Búsqueda del municipio de Tunja.
- Consulta de atributos geográficos mediante popups.
- Verificación de la visualización en dispositivos móviles.
- Publicación de la aplicación mediante GitHub Pages.

## 9. Publicación en GitHub Pages

La aplicación se encuentra publicada mediante GitHub Pages.

**Repositorio:**

https://github.com/mariselava99-gif/trabajo_final_marisela_vargas

**Aplicación web:**

https://mariselava99-gif.github.io/trabajo_final_marisela_vargas/

La publicación se configuró utilizando la rama `main` y la carpeta `/docs`.

**Consideración técnica:** GitHub Pages aloja los archivos de la aplicación, mientras que los servicios WMS y WFS continúan ejecutándose en GeoServer local. Por esta razón, la visualización completa de las capas geográficas requiere que GeoServer esté disponible desde el equipo donde se ejecuta la aplicación.

## 10. Conclusiones

El desarrollo permitió integrar una aplicación web cartográfica con servicios geográficos publicados en GeoServer, utilizando los estándares OGC WMS y WFS.

La implementación facilita la visualización, búsqueda y consulta de información espacial de los municipios de Boyacá, integrando herramientas de código abierto para el desarrollo de soluciones SIG basadas en tecnologías web.

## 11. Recursos de consulta

- Leaflet: https://leafletjs.com/
- Documentación de Leaflet: https://leafletjs.com/examples.html
- GeoServer: https://geoserver.org/
- Documentación de GeoServer: https://docs.geoserver.org/
- Open Geospatial Consortium (OGC): https://www.ogc.org/