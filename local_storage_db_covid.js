



createDBCovid = () => {
    // Initialise. If the database doesn't exist, it is created
    var covid = new localStorageDB("covid", localStorage);

    console.log("Hello");
    // create the "Time" table
    covid.createTable("Time", ["Date"]);

    // create the "Global" table
    covid.createTable("Global", ["NewConfirmed", "TotalConfirmed", "NewDeaths", "TotalDeaths", "NewRecovered", "TotalRecovered"]);

    covid.commit();

    var settings = {
        "url": "https://api.covid19api.com/summary",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        console.log(response);

        // create the table and insert records in one go
        covid.createTableWithData("Countries", response.Countries);

        // insert global stat
        covid.insert("Global", response.Global);

        covid.insert("Time", { Date: response.Date });

        covid.commit();
    });

    // commit the database to localStorage
    // all create/drop/insert/update/delete operations should be committed
    covid.commit();
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


printAll = () => {
    // Initialise. If the database doesn't exist, it is created
    var covid = new localStorageDB("covid", localStorage);

    let resQuery = covid.queryAll('Countries');
    console.log(resQuery);
    resQuery = covid.queryAll('Global');
    console.log(resQuery);
    resQuery = covid.queryAll('Countries');
    console.log(resQuery);
}


resetBase = () => {
    // Initialise. If the database doesn't exist, it is created
    var covid = new localStorageDB("covid", localStorage);

    covid.dropTable("Time");
    covid.dropTable("Global");
    covid.dropTable("Countries")

    covid.commit();
}