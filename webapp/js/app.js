
/**
 * Aplicación web SIG - Municipios de Boyacá
 * Leaflet + GeoServer WMS y WFS
 */

// ============================================
// CONFIGURACIÓN
// ============================================

const GEOSERVER_URL = 'http://localhost:8080/geoserver/boyaca/wms';
const WFS_URL = 'http://localhost:8080/geoserver/boyaca/wfs';

const NOMBRE_CAPA = 'boyaca:municipios_boyaca';

// ============================================
// INICIALIZAR MAPA
// ============================================

const map = L.map('map', {
    center: [5.54, -73.36],
    zoom: 8,
    minZoom: 5,
    maxZoom: 18
});

// ============================================
// MAPAS BASE
// ============================================

const baseLayers = {
    'OpenStreetMap': L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '&copy; OpenStreetMap contributors'
        }
    ),

    'Satélite': L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
            attribution: 'Tiles &copy; Esri'
        }
    )
};

baseLayers['OpenStreetMap'].addTo(map);

// ============================================
// CAPA WMS
// ============================================

const municipiosWMS = L.tileLayer.wms(GEOSERVER_URL, {
    layers: NOMBRE_CAPA,
    format: 'image/png',
    transparent: true,
    version: '1.1.1'
});

// ============================================
// CAPA WFS
// ============================================

let municipiosGeoJSON = null;
let municipiosData = null;

function cargarMunicipiosWFS() {

    const parametros = new URLSearchParams({
        service: 'WFS',
        version: '2.0.0',
        request: 'GetFeature',
        typeNames: NOMBRE_CAPA,
        outputFormat: 'application/json'
    });

    fetch(`${WFS_URL}?${parametros}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo consultar el servicio WFS');
            }
            return response.json();
        })
        .then(data => {

            municipiosData = data;

            municipiosGeoJSON = L.geoJSON(data, {

                style: {
                    color: '#24476b',
                    weight: 1.5,
                    fillColor: '#62a5d8',
                    fillOpacity: 0.45
                },

                onEachFeature: function(feature, layer) {

                    const propiedades = feature.properties || {};

                    let contenido = '<h3>Información del municipio</h3>';

                    Object.entries(propiedades).forEach(([campo, valor]) => {
                        if (valor !== null && valor !== undefined) {
                            contenido += `<p><strong>${campo}:</strong> ${valor}</p>`;
                        }
                    });

                    layer.bindPopup(contenido);

                    layer.on({
                        mouseover: function(e) {
                            e.target.setStyle({
                                weight: 3,
                                color: '#f39c12',
                                fillOpacity: 0.75
                            });
                        },

                        mouseout: function(e) {
                            municipiosGeoJSON.resetStyle(e.target);
                        },

                        click: function(e) {
                            map.fitBounds(e.target.getBounds());
                            actualizarInformacion(propiedades);
                        }
                    });
                }

            });

            municipiosGeoJSON.addTo(map);
            controlCapas.addOverlay(municipiosGeoJSON, 'Municipios Boyacá interactivos (WFS)');
            if (municipiosGeoJSON.getBounds().isValid()) {
                map.fitBounds(municipiosGeoJSON.getBounds());
            }

            actualizarInformacion();

            console.log('Municipios cargados:', data.features.length);
        })

        .catch(error => {
            console.error('Error cargando WFS:', error);

            alert(
                'No fue posible cargar los municipios. ' +
                'Verifica que GeoServer esté activo y revisa la consola.'
            );
        });
}

// ============================================
// CONTROL DE CAPAS
// ============================================

const controlCapas = L.control.layers(
    baseLayers,
    {
        'Municipios Boyacá (WMS)': municipiosWMS
    },
    {
        collapsed: false
    }
).addTo(map);

// ============================================
// PANEL DE INFORMACIÓN
// ============================================

const infoControl = L.control({
    position: 'topleft'
});

infoControl.onAdd = function() {
    this._div = L.DomUtil.create('div', 'info-control');
    this.update();
    return this._div;
};

infoControl.update = function(props) {

    if (!props) {
        this._div.innerHTML = `
            <h3>Municipios de Boyacá</h3>
            <p>Selecciona un municipio en el mapa para consultar su información.</p>
        `;
        return;
    }

    let html = '<h3>Información del municipio</h3>';

    Object.entries(props).forEach(([campo, valor]) => {
        if (valor !== null && valor !== undefined) {
            html += `<p><strong>${campo}:</strong> ${valor}</p>`;
        }
    });

    this._div.innerHTML = html;
};

infoControl.addTo(map);

function actualizarInformacion(props) {
    infoControl.update(props);
}

// ============================================
// ESCALA
// ============================================

L.control.scale({
    position: 'bottomleft',
    metric: true,
    imperial: false
}).addTo(map);

// ============================================
// BÚSQUEDA DE MUNICIPIOS
// ============================================

function buscarMunicipio() {

    const entrada = document.getElementById('search-input');
    const resultados = document.getElementById('search-results');

    if (!entrada || !resultados) return;

    const termino = entrada.value.trim().toLowerCase();

    if (!termino) {
        resultados.innerHTML = '<p>Escribe el nombre de un municipio.</p>';
        return;
    }

    if (!municipiosData) {
        resultados.innerHTML = '<p>Los datos todavía están cargando.</p>';
        return;
    }

    const coincidencias = municipiosData.features.filter(feature => {

        return Object.values(feature.properties || {}).some(valor =>
            String(valor ?? '').toLowerCase().includes(termino)
        );

    });

    if (coincidencias.length === 0) {
        resultados.innerHTML = '<p>No se encontraron coincidencias.</p>';
        return;
    }

    resultados.innerHTML = `<p>Resultados encontrados: ${coincidencias.length}</p>`;

    coincidencias.forEach(feature => {

        const item = document.createElement('button');

        item.textContent = Object.values(feature.properties || {})
            .find(valor => typeof valor === 'string') || 'Ver municipio';

        item.className = 'search-result-item';

        item.addEventListener('click', () => {

            municipiosGeoJSON.eachLayer(layer => {

                if (layer.feature === feature) {
                    map.fitBounds(layer.getBounds());
                    layer.openPopup();
                    actualizarInformacion(feature.properties);
                }

            });

        });

        resultados.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', () => {

    const boton = document.getElementById('search-button');
    const entrada = document.getElementById('search-input');

    if (boton) {
        boton.addEventListener('click', buscarMunicipio);
    }

    if (entrada) {
        entrada.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                buscarMunicipio();
            }
        });
    }

});

// ============================================
// INICIAR APLICACIÓN
// ============================================

window.addEventListener('load', () => {
    console.log('Iniciando mapa de municipios de Boyacá...');
    cargarMunicipiosWFS();
});
