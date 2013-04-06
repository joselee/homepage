define(
    [
        "backbone",
        "models/personModel"
    ],
    function PersonsCollection(Backbone, PersonModel){
        var PersonsCollection = Backbone.Collection.extend({
            model: PersonModel,
            url: "person/getAllPersons",

            getPersonIndex: function(personId){
                var person = this.find(function(model){
                    return model.get("id") === personId;
                });

                return this.models.indexOf(person);
            }
        });

        personsCollection = new PersonsCollection();
        personsCollection.fetch();

        return personsCollection;
    }
);