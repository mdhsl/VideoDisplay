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
    
    this.bindPopup();
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
    var qw = parseFloat(tokens[1]);
    var qx = parseFloat(tokens[2]);
    var qy = parseFloat(tokens[3]);
    var qz = parseFloat(tokens[4]);
    
    var qw2 = qw*qw;
    var qx2 = qx*qx;
    var qy2 = qy*qy;
    var qz2 = qz*qz;
    var test= qx*qy + qz*qw;
    
    var x,y,z;
    
    if (test > 0.499) {
      y = 360/Math.PI*Math.atan2(qx,qw);
      z = 90;
      x = 0;
    } else if (test < -0.499) {
      y = -360/Math.PI*Math.atan2(qx,qw);
      z = -90;
      x = 0;
    } else {
      var h = Math.atan2(2*qy*qw-2*qx*qz,1-2*qy2-2*qz2);
      var aa = Math.asin(2*qx*qy+2*qz*qw);
      var bb = Math.atan2(2*qx*qw-2*qy*qz,1-2*qx2-2*qz2);
      y = Math.round(h*180/Math.PI);
      z = Math.round(aa*180/Math.PI);
      x = Math.round(bb*180/Math.PI);
    }
    
    this.marker.setRotationAngle(x);
    
};

OSH.LeafletDataMarker.prototype.bindPopup = function() {
  //create popup 
  var videoDivId = "video-"+this.id;
  
  var div = document.createElement('div');
  var videoElt = '<img id="'+videoDivId+'" class="popup-video" width="250px" height="200px"></img>';
  div.innerHTML = videoElt;
  
  this.marker.bindPopup(div, {
    offset: new L.Point(0, -16),
    autoPan:false
  });
  
  this.imgTag = div.firstChild;
  
  //unbind popup and open a new dialog providing the video content
  $(this.imgTag).click(function() {
    var closeFn = function(event,ui)  {
      this.bindPopup();
    }.bind(this);
    
    $("#"+videoDivId).dialog({
        height:'auto', 
        width:'auto',
        close: closeFn,
        dialogClass:"popup-video"  
    });
    
    this.marker.closePopup();
    this.marker.unbindPopup();
  }.bind(this));
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
