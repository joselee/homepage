define(
    [
        "backbone",
        "models/personModel"
    ],
    function PersonsCollection(Backbone, PersonModel){
        var PersonsCollection = Backbone.Collection.extend({
            model: PersonModel,
            url: "feeds/people.json"
        });

        personsCollection = new PersonsCollection();
        personsCollection.fetch();

        return personsCollection;
    }
);