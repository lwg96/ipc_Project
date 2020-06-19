cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.loader.loadRes("/test", function (err, res) {
            console.log(err);
            console.log(JSON.stringify(res.toString()) );
        })
    },

    start() {

    },

    // update (dt) {},
});
