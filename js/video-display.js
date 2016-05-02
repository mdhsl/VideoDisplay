function init(){
  /***  little hack starts here ***/
  L.Map = L.Map.extend({
      openPopup: function(popup) {
          this._popup = popup;
          return this.addLayer(popup).fire('popupopen', {
              popup: this._popup
          });
      }
  }); /***  end of hack ***/
   
  var replayFactor = 2;

  //default options: bufferingTime = 0, replayFactor = 1
  var controller = OSH.Controller.getSingleton();

  // setup the controller. The synchronizedTime is turn to off because the data are the same but at different time
  controller.setOptions({
       bufferingTime:1*1000, // 5 seconds
       synchronizedTime: false, // disable synchronization for this set of data
       replayFactor:replayFactor
    });

  var data = [];
  // init the data. It's the same data at different time
  function initData() {
    var dat_1 = {
      GPS_URL : "ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:060693280a28e015-sos&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenomenonTime,2015-02-16T08:00:00Z/2015-02-16T08:09:00Z&replaySpeed="+replayFactor,
      ORIENTATION_URL : "ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:060693280a28e015-sos&observedProperty=http://sensorml.com/ont/swe/property/OrientationQuaternion&temporalFilter=phenomenonTime,2015-02-16T08:00:00Z/2015-02-16T08:09:00Z&replaySpeed="+replayFactor,
      VIDEO_URL : "ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:060693280a28e015-sos&observedProperty=http://sensorml.com/ont/swe/property/VideoFrame&temporalFilter=phenomenonTime,2015-02-16T08:00:00Z/2015-02-16T08:09:00Z&replaySpeed="+replayFactor
    }
    
    var dat_2 = {
      GPS_URL : "ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:060693280a28e015-sos&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenomenonTime,2015-02-16T08:01:00Z/2015-02-16T08:09:00Z&replaySpeed="+replayFactor,
      ORIENTATION_URL : "ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:060693280a28e015-sos&observedProperty=http://sensorml.com/ont/swe/property/OrientationQuaternion&temporalFilter=phenomenonTime,2015-02-16T08:01:00Z/2015-02-16T08:09:00Z&replaySpeed="+replayFactor,
      VIDEO_URL : "ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:060693280a28e015-sos&observedProperty=http://sensorml.com/ont/swe/property/VideoFrame&temporalFilter=phenomenonTime,2015-02-16T08:01:00Z/2015-02-16T08:09:00Z&replaySpeed="+replayFactor
    }
    
    var dat_3 = {
      GPS_URL : "ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:060693280a28e015-sos&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenomenonTime,2015-02-16T08:02:00Z/2015-02-16T08:09:00Z&replaySpeed="+replayFactor,
      ORIENTATION_URL : "ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:060693280a28e015-sos&observedProperty=http://sensorml.com/ont/swe/property/OrientationQuaternion&temporalFilter=phenomenonTime,2015-02-16T08:02:00Z/2015-02-16T08:09:00Z&replaySpeed="+replayFactor,
      VIDEO_URL : "ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:060693280a28e015-sos&observedProperty=http://sensorml.com/ont/swe/property/VideoFrame&temporalFilter=phenomenonTime,2015-02-16T08:02:00Z/2015-02-16T08:09:00Z&replaySpeed="+replayFactor
    }
    
    var dat_4 = {
      GPS_URL : "ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:060693280a28e015-sos&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenomenonTime,2015-02-16T08:03:00Z/2015-02-16T08:09:00Z&replaySpeed="+replayFactor,
      ORIENTATION_URL : "ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:060693280a28e015-sos&observedProperty=http://sensorml.com/ont/swe/property/OrientationQuaternion&temporalFilter=phenomenonTime,2015-02-16T08:03:00Z/2015-02-16T08:09:00Z&replaySpeed="+replayFactor,
      VIDEO_URL : "ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:060693280a28e015-sos&observedProperty=http://sensorml.com/ont/swe/property/VideoFrame&temporalFilter=phenomenonTime,2015-02-16T08:03:00Z/2015-02-16T08:09:00Z&replaySpeed="+replayFactor
    }
    
    var dat_5 = {
      GPS_URL : "ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:060693280a28e015-sos&observedProperty=http://sensorml.com/ont/swe/property/Location&temporalFilter=phenomenonTime,2015-02-16T08:04:00Z/2015-02-16T08:09:00Z&replaySpeed="+replayFactor,
      ORIENTATION_URL : "ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:060693280a28e015-sos&observedProperty=http://sensorml.com/ont/swe/property/OrientationQuaternion&temporalFilter=phenomenonTime,2015-02-16T08:04:00Z/2015-02-16T08:09:00Z&replaySpeed="+replayFactor,
      VIDEO_URL : "ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&version=2.0&request=GetResult&offering=urn:android:device:060693280a28e015-sos&observedProperty=http://sensorml.com/ont/swe/property/VideoFrame&temporalFilter=phenomenonTime,2015-02-16T08:04:00Z/2015-02-16T08:09:00Z&replaySpeed="+replayFactor
    }
    data.push(dat_1);
    data.push(dat_2);
    data.push(dat_3);
    data.push(dat_4);
    data.push(dat_5);
  }

  var map;
  // init the map
  function initmap() {
      // set up the map
      map = new L.Map('leafletMap', {
         fullscreenControl: true
      });

      // create the tile layer with correct attribution
      var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
      var osm = new L.TileLayer(osmUrl, {
          minZoom: 1,
          maxZoom: 17,
          attribution: osmAttrib
      });
      //,

      map.setView(new L.LatLng(0, 0), 15);
      map.addLayer(osm);

  }

  // init the controller and Websocket connections
  function initStream() {
      var controller = OSH.Controller.getSingleton();
      
      for (var i = 0; i < data.length; i++) {
          //get data marker
          var dataMarker = new OSH.LeafletDataMarker(map);
          
          // adds GPS stream for this data
          controller.addDataSource(this,
              data[i].GPS_URL,
              "text"+i,
              OSH.TimeStampParser.parseAndroidText,
              dataMarker.onUpdateLocationData.bind(dataMarker)
          );
          
          // adds Orienation stream for this data
          controller.addDataSource(this,
              data[i].ORIENTATION_URL,
              "text"+i,
              OSH.TimeStampParser.parseAndroidText,
              dataMarker.onUpdateOrientationData.bind(dataMarker)
          );
          
          //setup video
          
          // attach a video to dataMarker popup
          // creates a videoId to get events from inner component
          var videoContainerId = "video-"+i;
          var videoTagDivId = "video-inner-"+i;
          
          dataMarker.bindsPopup(videoContainerId,videoTagDivId);
              
          var oshVideo = new OSH.Video({
              id:videoTagDivId, // defines an id for the tag which will be created
              width:"250px",
              height:"200px",
              css:"popup-video",
              format:"mpeg", // switch between 'mp4' or 'mpeg'
              div:videoContainerId // the container to attach the video container
          });
          
          // adds Video stream for this data
          var uidVideo = controller.addDataSource(this,
              data[i].VIDEO_URL,
              "video"+i,
              oshVideo.parseTimeStamp.bind(oshVideo),
              oshVideo.onDataCallback.bind(oshVideo)
          );
      }
  }

  // init the data
  initData();

  // init the map
  initmap();

  // init the controller and Websocket connections
  initStream();
}
