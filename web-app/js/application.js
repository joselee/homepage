define(
    [
        "backbone.marionette",
        "views/layouts/mainLayout",
        "bootstrap"
    ],
    function Application(Marionette, mainLayout) {

        // Instantiate & Start the app!
        var Application = new Marionette.Application();
        Application.start();

        // Create a region for the body
        Application.addRegions({
            bodyRegion:"body"
        });

        // Show the main layout
        Application.addInitializer(function(){
            Application.bodyRegion.show(mainLayout);
        });
    }
);