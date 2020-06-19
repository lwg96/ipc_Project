module.exports = {
    load() {
        // 当 package 被正确加载的时候执行
        Editor.log(Editor.url('db://assets/'));
    },

    unload() {
        // 当 package 被正确卸载的时候执行
    },

    messages: {
        'openPanel'() {
            Editor.Panel.open('hello-world');
        },

        'find-all-spriteFrame'(event, data) {
            Editor.assetdb.queryAssets('db://assets/**\/*', 'sprite-frame', function (err, results) {
                Editor.log("find-all-spriteFrame:");
                if (event.reply) {
                    event.reply(results);
                }
            });
        },

        'hello-world:find-all-scene'(event) {
            Editor.assetdb.queryAssets('db://assets/**\/*', 'scene', function (err, results) {
                Editor.log("find-all-scene:", results);
                Editor.Scene.callSceneScript('hello-world', 'findUidByPath', results, function (uuidArr) {
                    Editor.Ipc.sendToPanel('hello-world', 'hello-world:allSceneUUid', uuidArr);
                });
            });
        },

        'hello-world:find-all-prefab'(event) {
            Editor.assetdb.queryAssets('db://assets/**\/*', 'prefab', function (err, results) {
                Editor.log("find-all-prefab:", results);
                Editor.Scene.callSceneScript('hello-world', 'findUidByPath', results, function (uuidArr) {
                    Editor.Ipc.sendToPanel('hello-world', 'hello-world:allprefabUUid', uuidArr);
                });
            });
        },

        'hello-world:move-All-UnuseSp'(event, data) {
            for (let i = 0; i < data.length; i++) {

                let str = Editor.assetdb.uuidToUrl(data[i]);
                Editor.log("通过uuid获得的路径 = ", str);
                let index = str.lastIndexOf("/");
                Editor.log("最后一个/的位置 = ", index);
                str = str.substr(0, index);
                Editor.log("实际的路径 = ", str);

                let fileName = str.substr(str.lastIndexOf("/") + 1, str.length - 1);
                Editor.log("fileName = ", fileName);
                Editor.assetdb.move(str, 'db://assets/dynamy/' + fileName, function (err, results) {
                    if (err) {
                        Editor.log("有问题 = ", err);
                        return;
                    }
                    // results.forEach(function (result) {
                    //     // result.srcPath
                    //     // result.destPath
                    //     // result.uuid
                    //     // result.parentUuid
                    // });
                });
            }
            // Editor.log("BBB = ", JSON.stringify(data));
        },

    },
};