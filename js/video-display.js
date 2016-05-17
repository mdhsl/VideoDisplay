function init(){
  var replayFactor = 2;
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

  function initStream() {
    var dataSourceProvider = new OSH.DataSource.DataSourceProvider({
        bufferingTime:0*1000, // 5 seconds
        synchronizedTime: false // does not sync the data
    });
     
    // creates controller 
    var controller = new OSH.Controller();
    controller.addDataSourceProvider(dataSourceProvider);

    // creates a map view
    var oshMapView = new OSH.UI.LeafletView("top-left");

    //a view can be fed by a same stream
    var oshCesiumView = new OSH.UI.CesiumView("bottom-left");
    
    //setup multiView to encapsulate the video divs
    var oshMultiView = new OSH.UI.MultiComponentView("top-right");
    
    var selectedVideoView = new OSH.UI.SelectedVideoView("bottom-right");
          
    // adds views to controller
    controller.addView(oshMapView);
    controller.addView(oshCesiumView);
    controller.addView(oshMultiView);
    controller.addView(selectedVideoView);
    
    // iterates over data to create marker + video popups                
    for (var i = 0; i < data.length; i++) {
      //creates data sources
      var latLonAltDataSource = new OSH.DataSource.LatLonAltDataSource("latLon-"+i,data[i].GPS_URL);
      var orientationDataSource = new OSH.DataSource.OrientationQuaternionDataSource("orientation-"+i,data[i].ORIENTATION_URL);
      var videoDataSource = new OSH.DataSource.VideoMjpegDataSource("video-"+i,data[i].VIDEO_URL);
      
      var oshVideoView = new OSH.UI.MJpegView("container-video-"+i,{
           css:"video"
      });
      
      // associates video stream to video view
      oshVideoView.setDataViewId(videoDataSource.getId());
     
      //set associated dataViews
      
      var dataViewGroup = [latLonAltDataSource.getId(),orientationDataSource.getId(),videoDataSource.getId()];
      
      oshVideoView.addAssociatedDataViews(dataViewGroup);
      selectedVideoView.addDataView(videoDataSource.getId(),dataViewGroup);
      
      oshMultiView.addView(oshVideoView);
      // adds marker to map
      oshMapView.addDataMarker({
        // associates GPS data to marker
        latLonDataViewId:latLonAltDataSource.getId(),
        orientationDataViewId:orientationDataSource.getId(),
        displayPath: true,
        associatedDataViews: dataViewGroup
      });
      
      //set dataView
      //add marker to map
      oshCesiumView.addDataMarker({
        latLonDataViewId:latLonAltDataSource.getId(),
        orientationDataViewId:orientationDataSource.getId(),
        associatedDataViews: dataViewGroup
      });
      
      // adds data sources to provider
      dataSourceProvider.addDataSource(latLonAltDataSource);
      dataSourceProvider.addDataSource(orientationDataSource);
      dataSourceProvider.addDataSource(videoDataSource);  
    }

    // starts streaming
    dataSourceProvider.connectAll();
  
  }
  // init the data
  initData();

  // init the controller and Websocket connections
  initStream();
}
