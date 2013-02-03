package homepage

import groovy.sql.Sql
import grails.converters.JSON

class PersonController {
	/* For basic CRUD operations. Navigate to /person */
	def scaffold = Person;
    def dataSource;

    def getAllPersons = {
        Sql sql = new Sql(dataSource);
        def result = sql.rows("SELECT * from person")
        render (result as JSON);

    }
}
