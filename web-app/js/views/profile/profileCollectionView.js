define(
    [
        "backbone.marionette",
        "views/profile/profileItemView",
        "collections/personsCollection",
        "router"
    ],
    function PersonsCollectionView(Marionette, ProfileItemView, personsCollection, Router){

        var PersonsCollectionView = Marionette.CollectionView.extend({
            className: "profileCollectionView",
            itemView: ProfileItemView,
            collection: personsCollection,
            initialize: function(){
                this.collection.on("sync", this.enablePagination, this);
            },
            onShow: function(){
                this.enablePagination();
            },
            enablePagination: function(){
                this.$el.page();
                this.pagination = this.$el.data("page");
                this.pagination.onpagechange = this.updateURL;
                this.scrollToProfile(this.options.profileId);
            },
            updateURL: function(){
                var currentModel = personsCollection.at(this.currentPage);
                Router.navigate("#profile/" + currentModel.get("id"));
            },
            scrollToProfile: function(profileId){
                var index = personsCollection.getPersonIndex(profileId);
                this.pagination.scrollToPage(index, {instant: true});
            }
        });

        return PersonsCollectionView;
    }
);