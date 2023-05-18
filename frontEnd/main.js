var scaleLineControl = new ol.control.ScaleLine();     // scale line oluşturur.


const raster = new ol.layer.Tile({
  source: new ol.source.OSM()
});

var vector;
var wkt = new ol.format.WKT();
const source = new ol.source.Vector({wrapX: false});

var vector = new ol.layer.Vector({            // çizim araçlarını ayarlar.
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


const modify = new ol.interaction.Modify({source: source});
map.addInteraction(modify);

let draw, snap;
const typeSelect = document.getElementById('type');

function addInteractions() {
  draw = new ol.interaction.Draw({
    source: source,
    type: typeSelect.value
  });
  map.addInteraction(draw);    
  snap = new ol.interaction.Snap({source: source});
  map.addInteraction(snap);     // çizime odaklanma
  draw.on('drawend', drawend);
}


/*
 * Handle change event.
 */
typeSelect.onchange = function () {
  map.removeInteraction(draw);
  map.removeInteraction(snap);
  addInteractions();
};

addInteractions();

function modalCreate() {
  modalSave.style.display = "block";
}


//  Save POP UP 
var modalSave = document.getElementById("myModalSave");
var span = document.getElementsByClassName("closeSave")[0];

function drawend(event) {
  modalCreate()             // çizim bittince pop up açar.
  feature = event.feature;
  wktString = wkt.writeFeature(event.feature);
  modalSave.style.display = "block";

  document.getElementById("myForm");  //pop up oluşturur.
}

span.onclick = function() {
  modalSave.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modalSave) {
      modalSave.style.display = "none";
  }
}


  /*    jQuery - AJAX    */

function getParsel() {
  $.ajax({
    type: 'GET',
    url: 'https://localhost:44318/api/parsel/all',
    dataType: 'json',
    contentType: 'application/json',
    data:{"data":"check"},
    success: function(data){
      for (var i in data){
        insert_function_ontable(data[i].id, data[i].wkt, data[i].sehir, data[i].ilce);
      } 
    }
  });
}


function postParsel() {                   // tüm parsel verilerini listeler.
  $.ajax({
    type:"POST",
    url:"https://localhost:44318/api/parsel/all",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({  'Wkt' : testWkt , 'IlParsel' : sehir , 'IlceParsel' : ilce , 'MahalleParsel' : mahalle }),
    success: function (message){
      alert( "Veriler Başarıyla POST Edildi!" );
    }
  })
} 


// verileri listeleme   

var xhr = new XMLHttpRequest();
var url = 'https://localhost:44318/api/parsel/all';
    
xhr.open("GET", url, true);
xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {   // readyState ve status değerlendirildi.
      
      var veri = JSON.parse(this.responseText);           // JSON Formatında verileri alırız.
      var table = document.getElementById("parselTable").getElementsByTagName('tbody')[0];
      
      for(var i = 0; i < veri.length; i++) {
        var row = table.insertRow(i);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);

        // satırlara verilecek verilerin idleri yazıldı. 
        //Tabloya yazdırılacak veriler eklenmiş oldu.
        
        cell1.innerHTML = veri[i].idParsel;
        cell2.innerHTML = veri[i].ilParsel;
        cell3.innerHTML = veri[i].ilceParsel;
        cell4.innerHTML = veri[i].mahalleParsel;
        cell5.innerHTML = veri[i].wkt;
      }
    }
};
xhr.send();

var testWkt;

// wkt konsola yazdırma 
map.on('click', function(evt) {     // onclick eventi tanımlandı.
  var feature = map.forEachFeatureAtPixel(evt.pixel,
    function(feature) {
      return feature;
    });
  if (feature) {
    // özelliğin WKT geometrisini alır
    var wktGeometry = new ol.format.WKT().writeGeometry(feature.getGeometry());   // çizimleri wkt formatına dönüştürür.
    console.log(wktGeometry);     // point(0,0) olarak konsola yazdırır.
    testWkt=wktGeometry;          // konsoldaki koordinatı testWkt değişkeninde tabloya ekliyoruz.
  }
});


//  $("#----").val();
function submitDataToServer(data) {
  var sehir = $("#ilSave").val();
  var ilce = $("#ilceSave").val();
  var mahalle = $("#mahalleSave").val();
  
  $.ajax({
    type:"POST",
    url:"https://localhost:44318/api/parsel/add",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({ 'Wkt' : testWkt , 'IlParsel' : sehir ,'IlceParsel' : ilce , 'MahalleParsel' : mahalle }),
    success: function (message){
      console.log(" Veriler POST edildi ! ");
    }
  })
}


// pop-up kayıt sonrası kapanır 
// sayfa otomatik refreshlenir
document.getElementById('saveButton').addEventListener('click', function() {  
  submitDataToServer();
  location.reload();      // sayfa refreshleme  (şu anlık kullanmaya gerek yok)
  modalSave.style.display = "none";
  
});





