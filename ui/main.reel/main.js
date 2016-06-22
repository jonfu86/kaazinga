/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {
    
    connection: {
        // value: "ws://localhost:8000/echo"
        // value: "wss://sandbox.kaazing.net/jms"
        value: {
            url: "wss://sandbox.kaazing.net/amqp091", // URL to Kaazing's public sandbox for WebSocket testing
            username: "guest",
            password: "guest"
        }
        
        
    },

    client: {
        value: null
    },

    clientID: {
        value: null
    },

    message: {
        value: null
    },

    // client: {
    //     value: UniversalClientDef("amqp")
    // },

    enterDocument: {
        value: function (firstTime) {
            if(firstTime){
                this.init();
            }
        }
    },

    init: {
        value: function () {
            this.client = UniversalClientDef("amqp");

            var client = this.client,
                connectionInfo = this.connection,
                messageCounter = 1,
                topicPub = "websocket-starter",
                topicSub = "websocket-starter",
                subscription = {},
                msgToSend,
                serverData,
                self = this;

            this.output = document.getElementById("output");
            this.clientID = "Client" + Math.random().toString(36).substring(2, 15); // generate a random ID
            
            this.client.connect(connectionInfo,
                self.onError,           // callback to process errors
                function (conn) {
                    conn.subscribe(
                        topicPub,  // Topic to send messages
                        topicSub,  // Topic to subscribe to receive messages
                        self.onMessage, // callback function to process received message
                        false,     // noLocal flag - setting this to 'false' allows you to receive your own messages
                        function (sub) {
                            // msgToSend=$('#messageToSend');
                            msgToSend = self.message;
                            // serverData = $('#server-data');
                            serverData = self.output;
                            subscription = sub;
                            console.info("Subscription is created " + subscription);
                            subscription.sendMessage({ message: "From " + clientID + ": Initial message is sent!" });
                            // msgToSend.val("Message " + messageCounter + " sent!");
                            self.message = "Message " + messageCounter + " sent!";
                        });
                }
            );

            // this.testWebSocket();
        }
    },

    // testWebSocket: {
    //     value: function () {
    //         var self = this;
    //         websocket = new WebSocket(this.connection);
    //         websocket.onopen = function(evt) { self.onOpen(evt) };
    //         websocket.onclose = function(evt) { self.onClose(evt) };
    //         websocket.onmessage = function(evt) { self.onMessage(evt) };
    //         websocket.onerror = function(evt) { self.onError(evt) };
    //     }
    // },

    onOpen: {
        value: function (evt) {
            this.writeToScreen("CONNECTED");
            // this.doSend("WebSocket rocks");
        }
    },

    onClose: {
        value: function (evt) {
            this.writeToScreen("DISCONNECTED");
        }
    },

    onMessage: {
        value: function (evt) {
            this.writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
            // websocket.close();
        }
    },

    onError: {
        value: function (evt) {
            this.writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
        }
    },

    doSend: {
        value: function (message) {
            this.writeToScreen("SENT: " + message);
            websocket.send(message);
        }
    },

    writeToScreen: {
        value: function (message) {
            var pre = document.createElement("p");
            pre.style.wordWrap = "break-word";
            pre.innerHTML = message;
            this.output.appendChild(pre);
        }
    },

    handleSendButtonAction: {
        value: function () {

            // if(this.messageBox.value){
            //     this.doSend(this.messageBox.value);
            //     this.messageBox.value = null;
            // }

            if(this.messageBox.value){
                var message = "From " + this.clientID + ": " + this.messageBox.value;
                subscription.sendMessage({ message: message });
                this.messageCounter++;
                message = "Message " + this.messageCounter + " sent!";
            }
            
        }
    },

    exitDocument: {
        value: function () {
            // this.client.close();
        }
    }
});
