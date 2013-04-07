define(
    [
        "backbone.marionette",
        "models/personModel",
        "hbs!templates/personViewTemplate"
    ],
    function PersonItemView(Marionette, PersonModel, PersonViewTemplate){
        var PersonItemView = Marionette.ItemView.extend({
            tagName: "a",
            className: "personItemView",
            template: PersonViewTemplate,
            initialize: function(){
                this.$el.attr("href", "#profile/" + this.model.get("id"));
            }
        });

        return PersonItemView;
    }
);