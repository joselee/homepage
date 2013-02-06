define(
    [
        "backbone.marionette",
		"router",
        "views/layouts/mainLayout"
    ],
    function Application(Marionette, Router, mainLayout) {

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
			Router.start();
        });
    }
);