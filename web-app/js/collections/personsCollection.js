define(
    [
        "backbone",
        "models/personModel"
    ],
    function PersonsCollection(Backbone, PersonModel){
        var PersonsCollection = Backbone.Collection.extend({
            model: PersonModel,
            url: "person/getAllPersons"
        });

        personsCollection = new PersonsCollection();
        personsCollection.fetch();

        return personsCollection;
    }
);