OSH.UI.MultiComponentView = Class.create(OSH.UI.View,{
    initialize: function($super,divId,options) {
        $super(divId);
        //create main div
        this.div = document.createElement('div');
        this.div.setAttribute("class","grid");
        
        document.getElementById(divId).appendChild(this.div);
        this.views = [];
        
        this.viewsDiv = new Hashtable();
    },
    
    addView: function(oshView) {
       var div = document.createElement('div');
       div.setAttribute("class","grid-cell");
       div.appendChild(document.getElementById(oshView.getDivId()));
       this.div.appendChild(div);
       
       this.views.push(oshView);
       this.viewsDiv.put(oshView.getDivId(),div);
    },
    
    selectDataView: function($super,id) {
      for(var i=0;i< this.views.length;i++) {
        var div = this.viewsDiv.get(this.views[i].getDivId());
        if(this.views[i].hasDataView(id)){
          div.style.border = "3px dashed green";
        } else {
          div.style.border = "none";
        }
      }
    },
    
    update: function($super,dataViewId, data) {
      for(var i=0;i < this.views.length; i++) {
        this.views[i].update(dataViewId,data);
      }
    }
});
