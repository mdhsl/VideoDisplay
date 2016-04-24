var first = true;

OSH.LeafletDataMarker = function(map) {
    this.map = map;
    this.pathCoordinates = [];
    //create marker
    this.markerIcon = L.icon({
        iconAnchor: [16, 16],
        iconUrl: 'images/arrow-direction.svg'
    });

    this.marker = L.marker([0, 0], {
        icon: this.markerIcon
    }).addTo(this.map);
    
    this.id = this.marker._leaflet_id;
    //create path
    this.path = new L.Polyline(this.pathCoordinates, {
        color: 'blue',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
    }).addTo(this.map);
    
    //create popup 
    var videoDivId = "video-"+this.id;
    
    var div = document.createElement('div');
    var videoElt = "<img id="+videoDivId+" class=\"popup-video\"></img>";
    div.innerHTML = videoElt;
    
    this.marker.bindPopup(div, {
      offset: new L.Point(0, -16),
      autoPan:false
    });
      
    this.imgTag = div.firstChild;
}

OSH.LeafletDataMarker.prototype.onUpdateLocationData = function(data) {
  var self = this;
  var rec = String.fromCharCode.apply(null, new Uint8Array(data));
  var tokens = rec.trim().split(",");
  var lat = parseFloat(tokens[1]);
  var lon = parseFloat(tokens[2]);
  var alt = parseFloat(tokens[3]);

  if (!isNaN(lon) && !isNaN(lat)) {
      var newLatLng = new L.LatLng(lat, lon);
      self.marker.setLatLng(newLatLng);

      if (first) {
          self.map.setView(self.marker.getLatLng(), self.map.getZoom());
          first = false;
      }
  }
  
  if (self.pathCoordinates.length > 200) {
     self.pathCoordinates.shift();
  }

  self.map.removeLayer(self.path);
  self.pathCoordinates.push(new L.LatLng(lat, lon));
  var path = new L.Polyline(self.pathCoordinates, {
     color: 'blue',
     weight: 5,
     opacity: 0.5,
     smoothFactor: 1
  }).addTo(self.map);;
}

OSH.LeafletDataMarker.prototype.onUpdateOrientationData = function(data) {
    var rec = String.fromCharCode.apply(null, new Uint8Array(data));
    var tokens = rec.trim().split(",");
    var x = parseFloat(tokens[1]);
    var y = parseFloat(tokens[2]);
};

OSH.LeafletDataMarker.prototype.textTimeStampParser = function(data) {
  var rec = String.fromCharCode.apply(null, new Uint8Array(data));
  var tokens = rec.trim().split(",");
  var date = new Date(tokens[0]);
  return date.getTime() - UTCAndroidShiftTime;
};

/**
 * Get binary video data
 */ 
OSH.LeafletDataMarker.prototype.onUpdateVideoData = function(data) {
  var imgBlob = new Blob([data]);
  var blobURL = window.URL.createObjectURL(imgBlob.slice(12));
  var oldBlobURL = this.imgTag.src;
  this.imgTag.src = blobURL;
  window.URL.revokeObjectURL(oldBlobURL);
};
