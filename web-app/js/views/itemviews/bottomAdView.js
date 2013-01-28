define(
    [
        "backbone.marionette",
        "hbs!templates/bottomAdViewTemplate"
    ],
    function BottomAdView(Marionette, bottomAdViewTemplate){
        var BottomAdView = Marionette.ItemView.extend({
            className: "bottomAdItemView",
            template: bottomAdViewTemplate
        });

        var bottomAdView = new BottomAdView();
        return bottomAdView;
    }
);