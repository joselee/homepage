package homepage

import org.atmosphere.cpr.*
import org.atmosphere.cpr.AtmosphereResource.TRANSPORT
import grails.converters.JSON

class ChatService {

    static transactional = false
    static atmosphere = [mapping: '/atmosphere/chat']

    def onRequest = { event ->
        try {
            AtmosphereRequest request = event.request
            if (request.method.equalsIgnoreCase("GET")) {
                event.suspend()
            } else if (request.method.equalsIgnoreCase("POST")) {
                event.broadcaster.broadcast(request.reader.readLine().trim())
            }
        } catch (Exception e) {
            println "ERROR!!!!!"
        }

    }

    def onStateChange = { event ->
        AtmosphereResource resource = event.resource
        AtmosphereResponse response = resource.response

        try {
            if (event.isSuspended()) {
                def msg = JSON.parse(event.message)
                response.writer.write( createMessage(msg.author, msg.message) )

                switch (resource.transport()) {
                    case TRANSPORT.JSONP:
                    case TRANSPORT.LONG_POLLING:
                        event.resource.resume()
                        break
                    default:
                        response.writer.flush()
                }
            } else if (!event.isResuming()) {
                event.broadcaster().broadcast( createMessage('Someone has left', '') )
            }
        } catch (Exception e) {
            println "ERROR in onStateChange: $e"
        }
    }

    private String createMessage(String author, String text) {
        return new JSON( [text : text, author : author, time : new Date().time] )
    }
}
