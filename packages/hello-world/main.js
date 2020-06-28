const {
    loadFile
} = require("./scene-Ctrl");

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
            let moveAllDir = 'db://assets/movedAllDir';
            let findSp = function () {
                Editor.assetdb.queryAssets('db://assets/**\/*', 'sprite-frame', function (err, results) {
                    Editor.log("find-all-spriteFrame:");
                    if (event.reply) {
                        event.reply(results);
                    }
                });
            }
            if (Editor.assetdb.exists(moveAllDir)) {
                Editor.assetdb.delete(moveAllDir, function (err, results) {
                    if (err) {
                        Editor.log("删除目录失败:");
                    } else {
                        Editor.log("删除目录成功");
                        findSp();
                    }
                })
            } else {
                findSp();
            }

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


            let createDirLink = [];

            let createDir = (dir) => {
                Editor.log("队列:", createDirLink);
                if (!Editor.assetdb.exists(dir) && createDirLink.indexOf(dir) == -1 ) {
                    createDirLink.push(dir);
                    Editor.assetdb.create(dir, "", function (err, results) {
                        if (err) {
                            Editor.log('创建目录失败:', dir);
                        } else {
                            createDirLink.shift();
                            Editor.log("创建目录成功:", dir)
                        }
                    });
                } else {
                    Editor.log('目录已经存在了或者正在队列中:', dir);
                }
            }

            let moveAllDir = 'db://assets/movedAllDir';
            createDir(moveAllDir);


            for (let i = 0; i < data.length; i++) {

                let uuidUrl = Editor.assetdb.uuidToUrl(data[i]);
                Editor.log("通过uuid获得的路径 = ", uuidUrl);

                let realPngUrl = uuidUrl.substring(0, uuidUrl.lastIndexOf("/"));
                Editor.log("实际的路径 = ", realPngUrl);

                let fileName = realPngUrl.substring(realPngUrl.lastIndexOf("/") + 1, realPngUrl.length);
                Editor.log("fileName = ", fileName);

                let midUrl = realPngUrl.substring(12, realPngUrl.lastIndexOf("/")); //db://assets/
                Editor.log("mid url = ", midUrl);

                let midUrlArr = midUrl.split("/");
                Editor.log("arr url = ", midUrlArr);

                moveAllDir = 'db://assets/movedAllDir';

                for (let j = 0, jLen = midUrlArr.length; j < jLen; j++) {
                    moveAllDir = moveAllDir + "/" + midUrlArr[j];
                    createDir(moveAllDir);
                }

                Editor.assetdb.move(realPngUrl, moveAllDir + '/' + fileName, function (err, results) {
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





            // let a = Editor.assetdb.exists('db://assets/foo');
            // Editor.log("BBB = ", JSON.stringify(data));
        },

    },
};