define(
    [
        "backbone.marionette",
        "views/personlist/personItemView",
        "collections/personsCollection"
    ],
    function PersonsCollectionView(Marionette, PersonItemView, personsCollection){

        var PersonsCollectionView = Marionette.CollectionView.extend({
            className: "PersonsCollectionView",
            itemView: PersonItemView,
            collection: personsCollection
        });

        return PersonsCollectionView;
    }
);