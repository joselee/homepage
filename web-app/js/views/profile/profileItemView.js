define(
    [
        "backbone.marionette",
        "hbs!templates/profileViewTemplate"
    ],
    function ProfileItemView(Marionette, ProfileViewTemplate){
        var ProfileItemView = Marionette.ItemView.extend({
            className: "profileItemView",
            template: ProfileViewTemplate
        });

        return ProfileItemView;
    }
);