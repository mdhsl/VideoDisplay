function init(){
  // init the controller and Websocket connections
  var dataSourceProvider = new OSH.DataSource.DataSourceProvider({
        bufferingTime:5*1000, // 5 seconds
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
  var oshChartView = new OSH.UI.D3ChartView("bottom-right",{
       css: "video",
       yLabel: "Test label Y"
  });
  //var selectedVideoView = new OSH.UI.SelectedVideoView("bottom-right",{
  //    format : "mjpeg" // 'mjpeg' or 'mp4' or 'h264'
      //codecs: "..." // mandatory for 'mp4' format
  //});
  
  // adds views to controller
  controller.addView(oshMapView);
  controller.addView(oshCesiumView);
  controller.addView(oshMultiView);
  controller.addView(oshChartView);
  //controller.addView(selectedVideoView);
      
  function addAssociatedData(associatedData) {
    var latLonAltDataSourceId = null;
    var orientationDataSourceId = null;
    var videoDataSource = null;
    var oshVideoView = null;
    var dataViewGroup = [];
    var chartDataSourceId = null;
    var curveName = "curve-"+OSH.Utils.randomUUID();
    
    for(var i = 0 ; i< associatedData.length; i++) {
        var data = associatedData[i];
      
      var options = {};
      if(data.androidShift) {
        options["androidShift"] = data.androidShift;
      }  
      //check type
      if(data.property == "http://sensorml.com/ont/swe/property/Location" || 
        data.property == "http://www.opengis.net/def/property/OGC/0/SensorLocation" ||
        data.property == "http://www.opengis.net/def/property/OGC/0/TargetLocation") {
        
        latLonAltDataSource = new OSH.DataSource.LatLonAltDataSource(data.name,data.url,options);
        dataSourceProvider.addDataSource(latLonAltDataSource);
        dataViewGroup.push(latLonAltDataSource.getId());
        latLonAltDataSourceId = latLonAltDataSource.getId();
      } else if(data.property == "http://sensorml.com/ont/swe/property/OrientationQuaternion") {
        orientationDataSource = new OSH.DataSource.OrientationQuaternionDataSource(data.name,data.url,options);
        dataSourceProvider.addDataSource(orientationDataSource);
        dataViewGroup.push(orientationDataSource.getId());
        orientationDataSourceId = orientationDataSource.getId();
      }else if(data.property == "http://sensorml.com/ont/swe/property/BodyTemperature"
              || data.property == "http://sensorml.com/ont/swe/property/HeartRate" ||
                 data.property == "http://sensorml.com/ont/swe/property/Weather" ) {
        
          chartDataSource = new OSH.DataSource.ChartDataSource(data.name,data.url,options);
          dataSourceProvider.addDataSource(chartDataSource);
          dataViewGroup.push(chartDataSource.getId());
          chartDataSourceId = chartDataSource.getId();
          curveName = data.name;
          
          //add curve to chart
          oshChartView.addCurve({
              name: curveName,
              dataViewId: chartDataSourceId
          });
      } else if(data.property == "http://sensorml.com/ont/swe/property/VideoFrame") {
        var oshVideoView;
        
        var format = "mjpeg";
        if(data.format != null) {
            format = data.format;
        }  
        
        var videoDataSource = new OSH.DataSource.VideoDataSource(data.name,data.url,{ type: format });
        dataViewGroup.push(videoDataSource.getId());
        
        var codecs = "avc1.42401F";
        if(data.codecs && data.codecs != null) {
            codecs = data.codecs;
        }
        
        var oshVideoView = new OSH.UI.VideoView("container-video-"+OSH.Utils.randomUUID(),{
            type: format,
            css: "video",
            codecs : codecs
        });
              
        // associates video stream to video view
        oshVideoView.setDataViewId(videoDataSource.getId());
        
        // adds data sources to provider
        dataSourceProvider.addDataSource(videoDataSource);
      }
    }
    
    if(videoDataSource != null) {
      oshVideoView.addAssociatedDataViews(dataViewGroup);
      //selectedVideoView.addDataView(videoDataSource.getId(),dataViewGroup);
      oshMultiView.addView(oshVideoView);
    }
    
    if(latLonAltDataSourceId != null || orientationDataSourceId != null) {
      // adds marker to map
      oshMapView.addDataMarker({
        // associates GPS data to marker
        latLonDataViewId:latLonAltDataSourceId,
        orientationDataViewId:orientationDataSourceId,
        displayPath: true,
        associatedDataViews: dataViewGroup
      });
      
      //set dataView
      //add marker to map
      oshCesiumView.addDataMarker({
        latLonDataViewId:latLonAltDataSourceId,
        orientationDataViewId:orientationDataSourceId,
        associatedDataViews: dataViewGroup
      });
    }
  }
  
  function changeView(id) {
      var input = document.getElementById(id);
      var action = (input.checked)? 'block' : 'none'; 
      var divMapped;
      
      if(id == "2d") {
        //top-left
        divMapped = "top-left";
      } else if(id == "3d") {
        divMapped = "bottom-left";
      } else if(id == "multi-video") {
        divMapped = "top-right";
      }else if(id == "full-video") {
        divMapped = "bottom-right";
      }
      
      document.getElementById(divMapped).parentElement.style.display = action;
  };

  //Parse the selected file to add new sensors
  ( function($) {
    $(document).ready(function() {
      document.getElementById('fileinput').addEventListener('change', function(){
          var file = this.files[0];
          var textType = /json.*/;

          if (file!= 'undefined' && file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
              getSensors(reader.result);
            }

            reader.readAsText(file);	
          } else {
            window.alert("File not supported, a .json file is expected");
          }
        }, false);
    });
  } ) (jQuery);

  function getSensors(jsonString) {
    var jsonObject = JSON.parse(jsonString);
    //iterates over sources
    var sources = jsonObject.sources;
    var dataSourceOptions = jsonObject.dataSourceOptions;
    
    //update provider data if needed
    if(dataSourceOptions) {
      //check if bufferingTime
      if(dataSourceOptions.synchronizeData) {
        dataSourceProvider.setSynchronized(dataSourceOptions.synchronizeData);
      }
      if(dataSourceOptions.replayFactor) {
        dataSourceProvider.setReplayFactor(dataSourceOptions.replayFactor);
      }
      if(dataSourceOptions.bufferingTime) {
        dataSourceProvider.setBufferingTime(dataSourceOptions.bufferingTime);
      }
      if(dataSourceOptions.startTime) {
        dataSourceProvider.setStartDate(new Date(dataSourceOptions.startTime));
      }
    }
    for(var i = 0; i < sources.length;i++) {
      var source = sources[i];
      var protocol = source.protocol;
      var type = source.type;
      var server = source.server;
      var offeringID= source.offeringID;
      
      var startTime = "now";
      var endTime = "2050-01-01T00:00:00Z";
      var replayFactor = dataSourceProvider.getReplayFactor();
      
      if(source.startTime) {
        startTime = source.startTime;
      }
      
      if(source.endTime) {
        endTime = source.endTime;
      }
      
      var associatedData = [];
      
      //iterates over properties
      var properties = source.properties;
      for(var j=0; j < properties.length; j++) {
        var property = properties[j];
        var responseFormat = null;
        if(property.format) {
          responseFormat = property.format;
        }
        
        var androidShift = false;
        if(property.androidShift) {
          androidShift = property.androidShift;
        }
        
        var codecs = null;
        if(property.codecs) {
          codecs = property.codecs;
        }        
        associatedData.push({
          name : property.name,
          url : getURL(protocol,type,server,offeringID,property.property,startTime,endTime,replayFactor,responseFormat),
          property : property.property,
          format : responseFormat,
          codecs: codecs,
          androidShift : androidShift          
        });
      }
      
      addAssociatedData(associatedData);
    }
    
    // starts streaming
    dataSourceProvider.connectAll();
  }
  /***
   * 
    ws://sensiasoft.net:8181/sensorhub/sos?service=SOS&
    version=2.0&
    request=GetResult&
    offering=urn:android:device:060693280a28e015-sos&
    observedProperty=http://sensorml.com/ont/swe/property/Location&
    temporalFilter=phenomenonTime,2015-02-16T08:00:00Z/2015-02-16T08:09:00Z&
    replaySpeed="+replayFactor
   * 
   */ 
  function getURL(protocol,type,server,offering,property, startTime, endTime,replayFactor,responseFormat) {
    var url = protocol+"://"+server+"?";
    //add service
    url += "service="+type+"&";
    //add version
    url += "version=2.0&";
    //add request
    url += "request=GetResult&";
    //add offering
    url += "offering="+offering+"&";
    //add observedProperty
    url += "observedProperty="+property+"&";
    //add temporalFilter
    url += "temporalFilter=phenomenonTime,"+startTime+"/"+endTime;
    
    //add replaySpeed
    if(replayFactor != null) {
      url += "&replaySpeed="+replayFactor;
    }
    
    if(responseFormat != null) {
      url += "&responseFormat="+responseFormat;
    }
    
    return url;
  }

}
























