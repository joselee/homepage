/* This is the outtermost layout of the page.
 This layout gets appended directly to the body. */

define(
    [
        "backbone.marionette",
        "hbs!templates/mainLayoutTemplate",
        "views/itemviews/headerView",
        "views/collectionviews/personsCollectionView",
        "views/itemviews/bottomAdView"
    ],
    function MainLayout(Marionette, MainLayoutTemplate, headerView, personsCollectionView, bottomAdView) {
        var MainLayout = Marionette.Layout.extend({
            template:MainLayoutTemplate,
            regions:{
                headerRegion:"#headerRegion",
                mainContentRegion:"#mainContentRegion",
                bottomAdRegion:"#bottomAdRegion"
            },
            onShow:function () {
                this.headerRegion.show(headerView);
                this.mainContentRegion.show(personsCollectionView);
                this.bottomAdRegion.show(bottomAdView);
            }
        });

        var mainLayout = new MainLayout();
        return mainLayout;
    }
);
