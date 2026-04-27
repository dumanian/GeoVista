var map = L.map('map').setView([-7.025, 110.38], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

var stats = {
  '2019': {mismatch_ha: 1047, persen: 2.7, hotspot: 'Kec. Mijen'}, 
  '2021': {mismatch_ha: 608, persen: 1.5, hotspot: 'Kec. Ngaliyan'},
  '2023': {mismatch_ha: 1216, persen: 3.1, hotspot: 'Kec. Mijen'}
};

function loadMismatch(year) {
  console.log("Mencoba memuat data tahun: " + year);
  if (mismatchLayer) map.removeLayer(mismatchLayer);
  
  fetch('data/mismatch_' + year + '.geojson')
    .then(r => {
      if (!r.ok) throw new Error("File data/mismatch_" + year + ".geojson TIDAK DITEMUKAN!");
      return r.json();
    })
    .then(data => {
      console.log("Data " + year + " Berhasil dimuat! Jumlah poligon: " + data.features.length);
      mismatchLayer = L.geoJSON(data, {
        style: {fillColor:'#F44336', color:'#B71C1C', weight:1, fillOpacity:0.7}
      }).addTo(map);
      updateStats(year);
    })
    .catch(err => {
      console.error(err);
      alert(err.message);
    });
}

function updateStats(year) {
  var d = stats[year];
  document.getElementById('stat-content').innerHTML =
    '<b>Periode:</b> '+year+'<br><b>Luas:</b> '+d.mismatch_ha+' ha<br><b>Hotspot:</b> '+d.hotspot;
}

var mismatchLayer = null;
// Jalankan otomatis saat web buka
loadMismatch('2023');

// Event untuk tombol (pastikan tombol di index.html punya class 'btn')
document.querySelectorAll('.btn').forEach(b => {
  b.addEventListener('click', function() {
    loadMismatch(this.dataset.year);
  });
});