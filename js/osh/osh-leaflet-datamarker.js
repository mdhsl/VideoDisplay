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
    
    // creates and binds a popup
   //this.bindPopup();
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
  
  // binds the popup
  this.marker.bindPopup(div, {
    offset: new L.Point(0, -16),
    autoPan:false
  });
  
  $(div).click(function() {
    var closeFn = function(event,ui)  {
      $("#"+contentId).dialog('destroy'); 
    };
    // opens a dialog based on the popup div
   dialog=  $("#"+contentId).dialog({
        width:'auto',
        maxWidth:'auto',
        close: closeFn,
        dialogClass:"popup-content",
        title: contentId  
    });
    $(".ui-dialog-titlebar-close span").removeClass("ui-icon-closethick").addClass("ui-icon-popupCloseButton");
    // close the current popup
    this.marker.closePopup();
  }.bind(this));
  /*if(append) {
    $("#"+contentId).appendTo("#"+divId);
  }
  //unbind popup and open a new dialog providing the video content
  $(div).click(function() {
      var closeFn = function(event,ui)  {
        this.bindsPopup(divId,contentId,true);
      }.bind(this);
    
      // opens a dialog based on the popup div
      $("#"+contentId).dialog({
          height:'auto', 
          width:'auto',
          close: closeFn,
          dialogClass:"popup-content"  
      });
      
      // close the current popup
      this.marker.closePopup();
      this.marker.unbindPopup();
  }.bind(this));*/
};

/*OSH.LeafletDataMarker.prototype.bindPopup = function(div) {
  
  this.videoDivId = "video-"+this.id;
  //create popup 
  // creates div element to encapsulate img tag
  var div = document.createElement('div');
  div.setAttribute("id", this.videoDivId );
  div.setAttribute("class","popup-video");
  // creates img tag
  //var videoElt = '<img id="'+this.videoDivId+'" class="popup-video" width="250px" height="200px"></img>';
  //div.innerHTML = videoElt;
  
  // binds the popup
  this.marker.bindPopup(div, {
    offset: new L.Point(0, -16),
    autoPan:false
  });

  // saves the imgTag  
  /*this.imgTag = div.firstChild;
  
  //unbind popup and open a new dialog providing the video content
  $(this.imgTag).click(function() {
    var closeFn = function(event,ui)  {
      this.bindPopup();
    }.bind(this);
    
    // opens a dialog based on the popup div
    $("#"+this.videoDivId).dialog({
        height:'auto', 
        width:'auto',
        close: closeFn,
        dialogClass:"popup-video"  
    });
    
    // close the current popup
    this.marker.closePopup();
    this.marker.unbindPopup();
  }.bind(this));
};*/

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
    /*var rec = String.fromCharCode.apply(null, new Uint8Array(data));
    var tokens = rec.trim().split(",");
    var qx = parseFloat(tokens[1]);
    var qy = parseFloat(tokens[2]);
    var qz = parseFloat(tokens[3]);
    var qw = parseFloat(tokens[4]);
    
    //normalize
    var norm = (qx * qx + qy * qy + qz * qz + qw * qw);

    if (norm > 0.0) {
        norm = 1.0 / Math.sqrt(norm);
        qx = norm * qx;
        qy = norm * qy;
        qz = norm * qz;
        qw = norm * qw;
    } else {
      qx = 0.0;
      qy = 0.0;
      qz = 0.0;
      qw = 0.0;
    }
    
    //rotate
    var v0 = 0;
    var v1 = 1;
    var v2 = 0;
    
    var twoxx = 2.0 * qx * qx;
    var twoyy = 2.0 * qy * qy;
    var twozz = 2.0 * qz * qz;
    
    var xy = qx * qy;
    var yz = qy * qz;
    var xz = qx * qz;
    var wx = qw * qx;
    var wy = qw * qy;
    var wz = qw * qz;
    
    var vx = v0 * (1.0 - twoyy - twozz) +
               v1 * (2.0 * (xy - wz)) +
               v2 * (2.0 * (xz + wy));
    
    var vy = v0 * (2.0 * (xy + wz)) +
               v1 * (1.0 - twoxx - twozz) +
               v2 * (2.0 * (yz - wx));
    
    var vz = v0 * (2.0 * (xz - wy)) +
               v1 * (2.0 * (yz + wx)) +
               v2 * (1.0 - twoxx - twoyy);
    
            
    var heading = 90. - ((Math.atan2(vy, vx)) * 180 / Math.PI); 
    heading = heading  * 180 / Math.PI;
    if (heading > 180.)
        heading -= 360.;
        
    self.marker.setRotationAngle(heading);*/
    
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
