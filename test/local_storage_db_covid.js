<reference path="jquery-2.0.3.js" />

createDBCovid = () => {
    // Initialise. If the database doesn't exist, it is created
    var covid = new localStorageDB("covid", localStorage);

    // Check if the database was just created. Useful for initial database setup
    if (covid.isNew()) {

        // create the "Time" table
        covid.createTable("Time", ["Date"]);

        // create the "Global" table
        covid.createTable("Global", ["NewConfirmed", "TotalConfirmed", "NewDeaths", "TotalDeaths", "NewRecovered", "TotalRecovered"]);

        var settings = {
            "url": "https://api.covid19api.com/summary",
            "method": "GET",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
            console.log(response);
        });


        // create the table and insert records in one go
        covid.createTableWithData("Countries", rows);

        // commit the database to localStorage
        // all create/drop/insert/update/delete operations should be committed
        covid.commit();
    }
}

diffTime = () => {

    // Initialise. If the database doesn't exist, it is created
    var covid = new localStorageDB("covid", localStorage);

    const resQuery = covid.queryAll('Time');
    let lastUpdate = new Date(resQuery[0].Date);
    lastUpdate.setHours(lastUpdate.getHours() + 6);
    if (Date.now() - lastUpdate > 0) {
        return true;
    } else {
        return false;
    }
}

updateDBcovid = () => {
    // Initialise. If the database doesn't exist, it is created
    var covid = new localStorageDB("covid", localStorage);

    covid.deleteRows("Time");
    covid.deleteRows("Global");
    
    var settings = {
        "url": "https://api.covid19api.com/summary",
        "method": "GET",
        "timeout": 0,
      };
      
      $.ajax(settings).done(function (response) {
        console.log(response);
      });

}