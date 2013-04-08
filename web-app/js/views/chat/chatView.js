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
            socket: null,
            subscription: null,
            request: null,
            author: "guest",
            onShow: function(){
                var self = this;
                this.socket = $.atmosphere;

                this.request = {
                    url: 'http://localhost:8080/atmosphere/chat',
                    contentType : "application/json",
                    logLevel : 'debug',
                    transport : 'websocket' ,
                    fallbackTransport: 'long-polling'
                };

                this.request.onOpen = function(response) {
                    console.info("connection is opened");
                    var data = JSON.stringify({ author: "Someone has joined", message: "" });
                    self.subscription.push(data);
                };
                this.request.onReconnect = function (request, response) {
                    console.info("connection reconnected");
                };
                this.request.onMessage = function (response) {
                    var message = $.parseJSON(response.responseBody);
                    self.appendMessage(message);
                };
                this.request.onError = function(response) {
                    console.info("errored.");
                };

                this.subscription = this.socket.subscribe(this.request);

                $("#tbChatInput", this.$el).on("keyup", function(e){
                    if(e.keyCode === 13){
                        var message = $(this).val();
                        var data = JSON.stringify({ author: self.author, message: message });
                        self.subscription.push(data);
                        $(this).val("");
                    }
                });

                $("#changeName", this.$el).on("click", function(){
                    self.author = $("#tbChatInput", self.$el).val();
                });
            },
            appendMessage: function(message){
                var content = $("#chatContent", this.$el);

                var messageModel = new Backbone.Model(message);
                var messageView = new MessageItemView({model: messageModel});
                content.append(messageView.el);
                content.scrollTop(content[0].scrollHeight);
            },
            onClose: function(){
                this.socket.unsubscribe();
            }
        });

        return ChatView;
    }
);