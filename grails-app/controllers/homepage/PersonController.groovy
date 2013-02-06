package homepage

import groovy.sql.Sql
import grails.converters.JSON

class PersonController {
	/* For basic CRUD operations. Navigate to /person */
	def scaffold = Person
    def dataSource

    def getAllPersons = {
        Sql sql = new Sql(dataSource)
        def result = sql.rows("SELECT * FROM person")
        render (result as JSON)

    }

    def getPersonById = {
        String personId = params.personId
        println(params)

        Sql sql = new Sql(dataSource)
        def result = sql.rows("SELECT * FROM person WHERE id=${personId}")
        render (result as JSON)
    }
}
