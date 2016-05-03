var first = true;

OSH.LeafletDataMarker = function(map) {
    this.map = map;
    this.pathCoordinates = [];
    this.bindPopup = false;
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
};

OSH.LeafletDataMarker.prototype.isBindPopup = function() {
  return this.bindPopup;
};

OSH.LeafletDataMarker.prototype.isPopupOpened = function() {
  return this.map.hasLayer(this.marker.getPopup())
};

OSH.LeafletDataMarker.prototype.bindsPopup = function(divId,contentId) {
  var div = document.createElement("div");
  div.setAttribute("id", divId);
  div.setAttribute("class","popup-content");
  
  //hack because the popup does not create the div yet
  document.getElementById("hiddenContainer").appendChild(div);

  this.addBind(div,contentId);
};

OSH.LeafletDataMarker.prototype.addBind = function(div,contentId){
  // binds the popup
  this.marker.bindPopup(div, {
    offset: new L.Point(0, -16),
    autoPan:false
  });
  
  div.onclick = function() {
    if(!this.dialog) {
      var contentDiv = document.getElementById(contentId);  
      this.dialog = new OSH.UI.Dialog({
          title: contentId
      });
      this.dialog.appendContent(div);
      this.dialog.setContentSize(contentDiv.width+"px",contentDiv.height+"px");
      this.dialog.onClose(function() {
          // binds the popup again
          this.dialog = null;
          this.addBind(div,contentId);
      }.bind(this));
    }
    // close the current popup
    this.marker.closePopup();
    this.marker.unbindPopup();    
  }.bind(this);
};

/**
 * Callback after receiving location values
 */ 
OSH.LeafletDataMarker.prototype.onUpdateLocationData = function(data) {
  var rec = String.fromCharCode.apply(null, new Uint8Array(data));
  var tokens = rec.trim().split(",");
  var lat = parseFloat(tokens[1]);
  var lon = parseFloat(tokens[2]);
  var alt = parseFloat(tokens[3]);

  if (!isNaN(lon) && !isNaN(lat)) {
      var newLatLng = new L.LatLng(lat, lon);
      this.marker.setLatLng(newLatLng);

      if (first) {
          this.map.setView(this.marker.getLatLng(), this.map.getZoom());
          first = false;
      }
  }
  
  if (this.pathCoordinates.length > 200) {
     this.pathCoordinates.shift();
  }

  // removes the layer
  this.map.removeLayer(this.path);
  
  // pushes new coordinates
  this.pathCoordinates.push(new L.LatLng(lat, lon));
  
  // adds the new layer
  var path = new L.Polyline(this.pathCoordinates, {
     color: 'blue',
     weight: 5,
     opacity: 0.5,
     smoothFactor: 1
  }).addTo(this.map);;
}

/**
 * Callback after receiving orientation values
 */ 
OSH.LeafletDataMarker.prototype.onUpdateOrientationData = function(data) {
    var rec = String.fromCharCode.apply(null, new Uint8Array(data));
    var tokens = rec.trim().split(",");
    var qx = parseFloat(tokens[1]);
    var qy = parseFloat(tokens[2]);
    var qz = parseFloat(tokens[3]);
    var qw = parseFloat(tokens[4]);

    //var q = new THREE.Quaternion(qx, qy, qz, qw);
    //var look = new THREE.Vector3( 0, 0, -1 );
    //look.applyQuaternion(q);
    
    // look dir vector
    var x = 0;
    var y = 0;
    var z = -1;

    // calculate quat * vector
    var ix =  qw * x + qy * z - qz * y;
    var iy =  qw * y + qz * x - qx * z;
    var iz =  qw * z + qx * y - qy * x;
    var iw = - qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    xp = ix * qw + iw * - qx + iy * - qz - iz * - qy;
    yp = iy * qw + iw * - qy + iz * - qx - ix * - qz;
    zp = iz * qw + iw * - qz + ix * - qy - iy * - qx;
    
    var yaw = 90 - (180/Math.PI*Math.atan2(yp, xp));

    this.marker.setRotationAngle(yaw);    
};
