define(
    [
        "backbone.marionette",
        "views/itemviews/profileItemView",
        "collections/personsCollection"
    ],
    function PersonsCollectionView(Marionette, ProfileItemView, personsCollection){

        var PersonsCollectionView = Marionette.CollectionView.extend({
            className: "profileCollectionView",
            itemView: ProfileItemView,
            collection: personsCollection
        });

        return PersonsCollectionView;
    }
);