(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      alert("Geolocation no es soportada en este navegador");
    }
  })();

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getMap(latitude, longitude);
  }
  function error() {
    alert("No se puede recibir la ubicación");
  }

  function getMap(latitude, longitude) {
    const map = L.map("map").setView([8.950185,-75.452208], 20); // 10 es el zoom
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    L.marker([8.950185,-75.452208]).addTo(map).bindPopup('Sucursal <b>PR MECHANIC</b>').openPopup();
  }