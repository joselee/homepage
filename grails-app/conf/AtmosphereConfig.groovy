atmospherePlugin {
    servlet {
        initParams = ['org.atmosphere.cpr.cometSupport': 'org.atmosphere.container.Tomcat7CometSupport']
    	urlPattern = '/atmosphere/*'
    }
    handlers {
    	atmosphereDotXml = {}
    }
}