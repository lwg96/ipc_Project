"use strict";
cc._RF.push(module, '76952BFHNNAIb26QPXerKG4', 'MainSceneCtrl');
// Scripts/MainSceneCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    cc.loader.loadRes("/test", function (err, res) {
      console.log(err);
      console.log(JSON.stringify(res.toString()));
    });
  },
  start: function start() {} // update (dt) {},

});

cc._RF.pop();