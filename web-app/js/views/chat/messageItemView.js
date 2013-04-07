define(
    [
        "backbone.marionette",
        "hbs!templates/messageItemViewTemplate"
    ],
    function MessageItemView(Marionette, messageItemViewTemplate){
        var MessageItemView = Marionette.ItemView.extend({
            tagName: 'div',
            className: 'messageItemView',
            template: messageItemViewTemplate,
            initialize: function(){
                this.$el.append(this.template());

                var formattedTime = moment().format("D MMM YYYY, HH:MM");

                $(".messageAuthor", this.$el).append(this.model.get("author"));
                $(".messageTime", this.$el).append(formattedTime);
                $(".messageText", this.$el).append(this.model.get("text"));
            }
        });

        return MessageItemView;
    }
);