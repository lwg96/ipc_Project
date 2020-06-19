module.exports = {
    "findUidByPath": function (event, allScene) {

        this.allScene = allScene;
        this.currentIndex = 0;
        this.uuidArr = [];
        this.event = event;
        this.checkLoadComplete();

        // Editor.log("测试了", !event.reply);
        // if(event.reply){
        //     event.reply(currentIndex/len);
        // }
        
    },

    checkLoadComplete(){
        Editor.log("开始了");
        let len = this.allScene.length;
        let currentIndex = this.currentIndex;
        if (currentIndex < len){
            let path = this.allScene[currentIndex].destPath;
            this.currentIndex++;
            this.loadFile(path);
        }else{
            Editor.log("完成了", this.uuidArr);
            if(this.event.reply){
                this.event.reply(this.uuidArr);
                Editor.log("回调了");
            }
            
        }
        
        

        
    },

    loadFile(path){
        let self = this;
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.open("get", path);
        xhr.send(null);
        xhr.onload = function () {
            if (xhr.status == 200) {
                Editor.log(xhr.responseText);
                var json = JSON.parse(xhr.responseText);
                for (let i = 0; i < json.length; i++) {
                    if (json[i]._spriteFrame){
                        Editor.log("有了");
                        let uuid = json[i]._spriteFrame.__uuid__
                        if (self.uuidArr.indexOf(uuid) == -1){
                            self.uuidArr.push(uuid);
                        }
                        
                    }
                }
                self.checkLoadComplete();
            }
        }
    }

};