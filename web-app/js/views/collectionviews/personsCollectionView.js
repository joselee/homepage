define(
    [
        "backbone.marionette",
        "views/itemviews/personItemView",
        "collections/personsCollection"
    ],
    function PersonsCollectionView(Marionette, PersonItemView, personsCollection){

        var PersonsCollectionView = Marionette.CollectionView.extend({
            className: "PersonsCollectionView",
            itemView: PersonItemView,
            collection: personsCollection
        });

        var personsCollectionView = new PersonsCollectionView();
        return personsCollectionView;
    }
);