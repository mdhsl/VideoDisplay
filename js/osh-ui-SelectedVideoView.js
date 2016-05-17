OSH.UI.SelectedVideoView = Class.create(OSH.UI.View,{
  initialize: function($super,divId,options) {
    $super(divId);
    this.view = new OSH.UI.MJpegView("full-container-video",{
        css:"video"
    });
    
    var div = document.getElementById(this.divId);
    div.setAttribute("id","test");
    div.appendChild(document.getElementById(this.view.getDivId()));
    this.viewIds = new Hashtable();
  },
  
  addDataView : function(videoViewDataId, associatedDataViewIds) {
    for(var i = 0; i < associatedDataViewIds.length; i++) {
      this.viewIds.put(associatedDataViewIds[i],videoViewDataId);
    }
  },
  setData: function($super,data) {
    this.view.setData(data);
  },
  
  setDataViewId: function($super,dataViewId) {
    this.view.setDataViewId(dataViewId);
  },
  
  hasDataView: function($super,dataViewId) {
    return this.viewIds.containsKey(dataViewId) || this.viewIds.containsValue(dataViewId);
  },
  
  update: function($super,dataViewId, data) {
    this.view.update(dataViewId,data);
  },
  
  selectDataView: function($super,idArr) {
    for(var j=0; j < idArr.length; j++) {
        //update view if
        if(this.viewIds.containsKey(idArr[j])) {
          var d = this.viewIds.get(idArr[j]);
          this.setDataViewId(d);
          break;
        } else if(this.viewIds.containsValue(idArr[j])) {
           this.setDataViewId(idArr[j]);
           break;
        }
    }
  }
  
});
