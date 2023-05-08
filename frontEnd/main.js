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
    type: typeSelect.value,
  });
  map.addInteraction(draw);    
  snap = new ol.interaction.Snap({source: source});
  map.addInteraction(snap);     // çizime odaklanma (snap)
  draw.on('drawend', drawend);
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

function modalCreate() {
  modalSave.style.display = "block";
}


//      Save POP UP 
var modalSave = document.getElementById("myModalSave");
var span = document.getElementsByClassName("closeSave")[0];

function drawend(event) {
  modalCreate()             // çizim bittince pop up açar.
  feature = event.feature;
  wktString = wkt.writeFeature(feature);

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



//      Delete - Edit POP-UP


//var modalDel = document.getElementById("myModalDel");
//var span_ = document.getElementsByClassName("closeDel")[0];


/*  Delete / Edit Yapılacak!  */



var feature;
 
function ParselEdit(feature) {
  const { 
    idParsel, ilParsel, ilceParsel, wktString} = feature.A;

  deleteId = idParsel;
  document.getElementById('ilDelete').value = ilParsel;
  document.getElementById('ilceDelete').value = ilceParsel;
  var editWkt = feature.A.wktString;
  var editId = feature.A.idParsel;





  /*    jQuery - AJAX    */

  function getParsel(){
    $.ajax({
      type: 'get',
      url: 'https://localhost:44318/api/parsel/all',
      dataType: 'json',
      contentType: 'application/json',
      data:{"data":"check"},
      success: function(data){
        for (var i in data){
          insert_function_ontable(data[i].id,data[i].wkt,data[i].sehir,data[i].ilce);
      } 
    }
  });
  }


function postParsel() {                   // tüm parsel verilerini listeler.
  $.ajax({
    type:"post",
    url:"https://localhost:44318/api/parsel",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify({'wkt':wkt, 'sehir':sehir, 'ilce':ilce}),
    success: function (message){
      alert( "Veriler Başarıyla POST Edildi!" );
    }
  })
} 


function addParsel(id, sehir, wkt, ilce) {
  $.ajax({
    type: "add",                                  
    url: "https://localhost:44318/api/parsel/add",
    dataType: "json",                              
    contentType: "application/json",
    data: JSON.stringify({"id": id, "sehir": sehir, "wkt": wkt, "ilce": ilce}),
    success: function(message){                        
      alert( "Veri Başarıyla Eklendi!" );
    }
  })
}


function updateParsel(id,new_sehir,new_wkt,new_ilce) {   // güncellenecek parselin yeni parametreleri
  $.ajax({
    type: "post",                                       // yapılacak işlem türü
    url: "https://localhost:44318/api/parsel/update",
    dataType: "json",                                   // JSON formatında veri gönderir.
    contentType: "application/json",
    data: JSON.stringify({"id": id, "sehir": new_sehir, "wkt": new_wkt, "ilce":new_ilce}),
    success: function(message){                         // başarılıysa alert verir.
      alert( "Veri Başarıyla Güncellendi!" );
    }
  })
}


$(document).ready(function(){
  $("#delButton").on("click", function(){
    $.ajax({
      type: "delete",                 
      url: "https://localhost:44318/api/parsel/delete",
      dataType:"json",
      contentType: "application/json",
      data: JSON.stringify({"id": id, "sehir": new_sehir, "wkt": new_wkt, "ilce":new_ilce}),
      success: function(message){
        alert( "Veri Başarıyla Silindi!" );
      }
    })
  })
})


$(document).ready(function(){
	$("#saveButton").on("click", function(){ 
		var saveForm = $("#parselForm").serialize(); 
		$.ajax({
			url:'https://localhost:44318/api/parsel/update', 
			type:'POST', 
			data: saveForm,
			success:function(e){ 
				$("div").html("").html(e);  // her seferinde div boş hale getirir gelen verileri ekler
			}
		});
		
	});
});


$(document).ready(function(){
	$("#delButton").on("click", function(){ 
		var deleteForm = $("#parselDelForm").serialize(); 
		$.ajax({
			url:'https://localhost:44318/api/parsel/delete', 
			type:'POST', 
			data: deleteForm,
			success:function(e){ 
				$("div").html("").html(e);
			}
		});
	});
});



/*

function submitFormAjax() {
  var form = document.getElementById('parselSaveForm');
  var formData = new FormData(form);
  
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/submit-form');
  xhr.onload = function() {
    if (xhr.status === 200) {                 
      alert(' Form başarıyla gönderildi! ');
    } 
    else {
      alert(' Form gönderme başarısız! ');
    }
  };
  xhr.send(formData);
}
   

document.getElementById('saveButton').addEventListener('click', function() {  
  submitFormAjax();
});                        //buttona listener atar ve save butonuna basıldığında submitFormAjax fonksiyonunu çağırır. 

document.getElementById('updButton').addEventListener('click', function() {  
  submitFormAjax();
});

document.getElementById('delButton').addEventListener('click', function() {  
  submitFormAjax();
});

*/


//       http request 

var xhr = new XMLHttpRequest();
var url = "https://localhost:44318/api/parsel/all";

xhr.open("GET", url, true);
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    var result = JSON.parse(xhr.responseText);
    console.log(result);
  }
};
xhr.send();

 //       verileri listeleme   

var xhr = new XMLHttpRequest();
    
xhr.open("GET", url, true);
xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {     // readyState ve status değerlendirildi.
      var veri = JSON.parse(this.responseText);           // JSON Formatında verileri alırız.
      var table = document.getElementById("parselTable").getElementsByTagName('tbody')[0];
      for(var i = 0; i < veri.length; i++) {
        var row = table.insertRow(i);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        // satırlara verilecek verilerin idleri yazıldı. 
        //Tabloya yazdırılacak veriler eklenmiş oldu.
        cell1.innerHTML = veri[i].idParsel;
        cell2.innerHTML = veri[i].ilParsel;
        cell3.innerHTML = veri[i].ilceParsel;
        cell4.innerHTML = veri[i].mahalleParsel;
          
      }
    }
};
xhr.send();

//       Tablo veri güncelleme 

xhr.open("GET", url, true);

xhr.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {

		var data = JSON.parse(this.responseText);

		var table = document.getElementById("parselTable");
			for (var i = 0; i < data.length; i++) {
				var row = table.insertRow(i+1);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = data[i].idParsel;
				cell2.innerHTML = data[i].ilParsel;
				cell3.innerHTML = data[i].ilceParsel;
        cell4.innerHTML = data[i].mahalleParsel;

			}
	} 
};

xhr.send();

}