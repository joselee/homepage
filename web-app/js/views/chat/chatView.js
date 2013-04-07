define(
    [
        "backbone.marionette",
        "hbs!templates/chatViewTemplate"
    ],
    function ChatView(Marionette, ChatViewTemplate){
        var ChatView = Marionette.ItemView.extend({
            className: "ChatView",
            template: ChatViewTemplate,
            onShow: function(){
                var socket = $.atmosphere;

                var request = {
                    url: 'http://localhost:8080/atmosphere/chat',
                    contentType : "application/json",
                    logLevel : 'debug',
                    transport : 'websocket' ,
                    fallbackTransport: 'long-polling'
                };
                
                request.onOpen = function(response) {
                    console.info("connection is opened");
                };
                request.onReconnect = function (request, response) {
                    console.info("connection reconnected");
                };
                request.onMessage = function (response) {
                    var message = response.responseBody;
                    console.info("got a message: " + message);
                };
                request.onError = function(response) {
                    console.info("errored.");
                };

                var subSocket = socket.subscribe(request);

                $("#testDiv", this.$el).on("click", function(){
                    console.info("testDiv click");
                    var data = JSON.stringify({ author: "foo", message: "bar" });
                    subSocket.push(data);
                });
            }
        });

        return ChatView;
    }
);