
var scaleLineControl = new ol.control.ScaleLine();     // scale line oluşturur.


const raster = new ol.layer.Tile({
  source: new ol.source.OSM(),
});

const source = new ol.source.Vector({wrapX: false});

var vector = new ol.layer.Vector({
  source: source,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: "rgba(255, 255, 255, 0.2)",
    }),
    stroke: new ol.style.Stroke({
      color: "#ffcc33",
      width: 2,
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: "#ffcc33",
      }),
    }),
  }),
});

var map = new ol.Map({                                 // haritayı oluşturur.
  controls: ol.control.defaults({
    attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
      collapsible: false
    })
  }).extend([scaleLineControl]),
  layers: [new ol.layer.Tile({
    source: new ol.source.OSM()
  }),
  vector
  ],
  target: 'map',
  view: tr_default = new ol.View({
    center: [35.51117486687671, 38.48532145357543],    // türkiye'nin konumuna odaklandı.
    zoom: 6,
    projection: 'EPSG:4326'
  })
});

/* yeni eklendi*/
const modify = new ol.interaction.Modify({source: source});
map.addInteraction(modify);
/**/
let draw, snap;
const typeSelect = document.getElementById('type');

function addInteractions() {
  draw = new ol.interaction.Draw({
    source: source,
    type: typeSelect.value,
  });
  map.addInteraction(draw);
  snap = new ol.interaction.Snap({source: source});
  map.addInteraction(snap);
}

/**
 * Handle change event.
 */
typeSelect.onchange = function () {
  map.removeInteraction(draw);
  map.removeInteraction(snap);
  addInteractions();
};

addInteractions();



