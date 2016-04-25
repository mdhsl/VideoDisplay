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
    
    // creates and binds a popup
    this.bindPopup();
}

/**
 * Callback after receiving location values
 */ 
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

  // removes the layer
  self.map.removeLayer(self.path);
  
  // pushes new coordinates
  self.pathCoordinates.push(new L.LatLng(lat, lon));
  
  // adds the new layer
  var path = new L.Polyline(self.pathCoordinates, {
     color: 'blue',
     weight: 5,
     opacity: 0.5,
     smoothFactor: 1
  }).addTo(self.map);;
}

/**
 * Callback after receiving orientation values
 */ 
OSH.LeafletDataMarker.prototype.onUpdateOrientationData = function(data) {
    var rec = String.fromCharCode.apply(null, new Uint8Array(data));
    var tokens = rec.trim().split(",");
    var qw = parseFloat(tokens[1]);
    var qx = parseFloat(tokens[2]);
    var qy = parseFloat(tokens[3]);
    var qz = parseFloat(tokens[4]);
    
    //from https://android.googlesource.com/platform/external/jmonkeyengine/+/master/engine/src/core/com/jme3/math/Quaternion.java
    var angles = [3];
    
    var sqw = qw * qw;
    var sqx = qx * qx;
    var sqy = qy * qy;
    var sqz = qz * qz;
    var unit = sqx + sqy + sqz + sqw; // if normalized is one, otherwise
    // is correction factor
    var test = qx * qy + qz * qw;
    if (test > 0.499 * unit) { // singularity at north pole
        angles[1] = 2 * Math.atan2(qx, qw);
        angles[2] = Math.PI/2;
        angles[0] = 0;
    } else if (test < -0.499 * unit) { // singularity at south pole
        angles[1] = -2 * Math.atan2(qx, qw);
        angles[2] = -Math.PI/2;
        angles[0] = 0;
    } else {
        angles[1] = Math.atan2(2 * qy * qw - 2 * qx * qz, sqx - sqy - sqz + sqw); // roll or heading 
        angles[2] = Math.asin(2 * test / unit); // pitch or attitude
        angles[0] = Math.atan2(2 * qx * qw - 2 * qy * qz, -sqx + sqy - sqz + sqw); // yaw or bank
    }
        
    yaw = angles[0] * 180 / Math.PI;
    this.marker.setRotationAngle(yaw);
    
};

OSH.LeafletDataMarker.prototype.bindPopup = function() {
  //create popup 
  var videoDivId = "video-"+this.id;
  
  // creates div element to encapsulate img tag
  var div = document.createElement('div');
  // creates img tag
  var videoElt = '<img id="'+videoDivId+'" class="popup-video" width="250px" height="200px"></img>';
  div.innerHTML = videoElt;
  
  // binds the popup
  this.marker.bindPopup(div, {
    offset: new L.Point(0, -16),
    autoPan:false
  });

  // saves the imgTag  
  this.imgTag = div.firstChild;
  
  //unbind popup and open a new dialog providing the video content
  $(this.imgTag).click(function() {
    var closeFn = function(event,ui)  {
      this.bindPopup();
    }.bind(this);
    
    // opens a dialog based on the popup div
    $("#"+videoDivId).dialog({
        height:'auto', 
        width:'auto',
        close: closeFn,
        dialogClass:"popup-video"  
    });
    
    // close the current popup
    this.marker.closePopup();
    this.marker.unbindPopup();
  }.bind(this));
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
