define(
    [
        "backbone.marionette",
        "hbs!templates/chatViewTemplate",
        "views/chat/messageItemView"
    ],
    function ChatView(Marionette, ChatViewTemplate, MessageItemView){
        var ChatView = Marionette.ItemView.extend({
            className: "ChatView",
            template: ChatViewTemplate,
            onShow: function(){
                var self = this;
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
                    var message = $.parseJSON(response.responseBody);
                    self.appendMessage(message);
                };
                request.onError = function(response) {
                    console.info("errored.");
                };

                var subSocket = socket.subscribe(request);

                $("#btnSend", this.$el).on("click", function(){
                    var data = JSON.stringify({ author: "Jose Lee", message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse risus orci, dignissim sed sodales in, rhoncus nec sem. Sed et velit lectus, id dignissim ante." });
                    subSocket.push(data);
                });
            },
            appendMessage: function(message){
                var content = $("#chatContent", this.$el);

                var messageModel = new Backbone.Model(message);
                var messageView = new MessageItemView({model: messageModel});
                content.append(messageView.el);
                content.scrollTop(content[0].scrollHeight);
            }
        });

        return ChatView;
    }
);