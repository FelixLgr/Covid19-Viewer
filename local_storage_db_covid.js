createDBCovid = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);
    // create the "Time" table
    covid.createTable("Time", ["Date"]);
    console.log("Table créée => " + "Time");



    // create the "Global" table
    covid.createTable("Global", ["NewConfirmed", "TotalConfirmed", "NewDeaths", "TotalDeaths", "NewRecovered", "TotalRecovered"]);
    console.log("Table créée => " + "Global");

    // create the "EvolutionCountries" table
    covid.createTable("EvolutionCountries", ["CountryCode", "Confirmed", "Deaths", "Recovered", "Date"]);
    console.log("Table créée => " + "EvolutionCountries");

    // create the "EvolutionCountries" table
    covid.createTable("Countries", ["Country", "CountryCode", "Slug", "NewConfirmed", "TotalConfirmed", "NewDeaths", "TotalDeaths", "NewRecovered", "TotalRecovered", "Date"]);
    console.log("Table créée => " + "Countries");




    covid.commit();

    let settings = {
        "url": "https://api.covid19api.com/summary",
        "method": "GET",
        "timeout": 0,
        async: false
    };

    $.ajax(settings).done(function (response) {
        console.log(response);

        response.Countries.forEach(element => {
            covid.insert("Countries", {
                Country: element.Country,
                CountryCode: element.CountryCode,
                Slug: element.Slug,
                NewConfirmed: element.NewConfirmed,
                TotalConfirmed: element.TotalConfirmed,
                NewDeaths: element.NewDeaths,
                TotalDeaths: element.TotalDeaths,
                NewRecovered: element.NewRecovered,
                TotalRecovered: element.TotalRecovered,
                Date: element.Date
            });
            covid.commit();
        });

        covid.commit();
        
        // insert global stat
        covid.insert("Global", response.Global);

        const timing = response.Date;
        covid.insert("Time", {
            Date: timing
        });


        covid.commit();
    });



    // commit the database to localStorage
    // all create/drop/insert/update/delete operations should be committed
    covid.commit();
}

dbCovidExist = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);
    console.log(covid.tableCount());

    return covid.tableCount() === 4;
}

diffTime = () => {

    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    const resQuery = covid.queryAll('Time');
    let lastUpdate = new Date(resQuery[0].Date);
    lastUpdate.setHours(lastUpdate.getHours() + 6);
    return Date.now() - lastUpdate > 0;
}

findNameCountry = (codeCountry) => {

    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    const resQuery = covid.queryAll("Countries", {
        query: {
            CountryCode: codeCountry
        }
    });

    return resQuery[0].Country;
}

addEvoCountry = (codeCountry) => {


    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    const nameCountry = findNameCountry(codeCountry);
    const apiUrl = "https://api.covid19api.com/total/country/" + nameCountry;

    var settings = {
        "url": apiUrl,
        "method": "GET",
        "timeout": 0,
        async: false
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        response.forEach(element => {
            covid.insert("EvolutionCountries", {
                CountryCode: codeCountry,
                Confirmed: element.Confirmed,
                Deaths: element.Deaths,
                Recovered: element.Recovered,
                Date: element.Date
            });
            covid.commit();
        });

    });

    covid.commit();
}

updateDBCovid = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    covid.deleteRows("Time");
    covid.deleteRows("Global");

    let settings = {
        "url": "https://api.covid19api.com/summary",
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        response.Countries.forEach(element => {
            covid.insertOrUpdate("Countries", {
                CountryCode: element.CountryCode
            }, {
                Country: element.Country,
                CountryCode: element.CountryCode,
                Slug: element.Slug,
                NewConfirmed: element.NewConfirmed,
                TotalConfirmed: element.TotalConfirmed,
                NewDeaths: element.NewDeaths,
                TotalDeaths: element.TotalDeaths,
                NewRecovered: element.NewRecovered,
                TotalRecovered: element.TotalRecovered,
                Date: element.Date
            });
            covid.commit();
        });

        // insert global stat
        covid.insert("Global", response.Global);

        const timing = response.Date;
        covid.insert("Time", {
            Date: timing
        });

        covid.commit();
    });

    covid.commit();

}


printAll = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    let resQuery = covid.queryAll("Countries");
    console.log(resQuery);
    resQuery = covid.queryAll("Global");
    console.log(resQuery);
    resQuery = covid.queryAll("Time");
    console.log(resQuery);
    resQuery = covid.queryAll("EvolutionCountries");
    console.log(resQuery);
}

selectCountriesCode = (countriesStat) => {

    let tabCodeCountries = [];

    countriesStat.forEach(element => {
        tabCodeCountries.push(element.CountryCode);
    });
    return tabCodeCountries;
}

resetBase = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    if (covid.tableExists("Time")) {
        covid.dropTable("Time");
    }
    if (covid.tableExists("Global")) {
        covid.dropTable("Global");
    }
    if (covid.tableExists("Countries")) {
        covid.dropTable("Countries");
    }
    if (covid.tableExists("EvolutionCountries")) {
        covid.dropTable("EvolutionCountries");
    }

    if (covid.tableExists("test")) {
        covid.dropTable("test");
    }
    covid.commit();
}

selectGlobal = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    let resQuery = covid.queryAll("Global");
    return resQuery[0];
}

selectTime = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);
    let resQuery = covid.queryAll("Time");
    const datestr = resQuery[0].Date;
    const dateAPI = new Date(datestr);

    let months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const mounth = months[dateAPI.getMonth()]
    const year = dateAPI.getFullYear()
    const day = dateAPI.getDate();
    return day + " " + mounth + " " + year;
}


selectCountries = () => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    let resQuery = covid.queryAll("Countries");
    return resQuery;
}

/*
lib.queryAll("books", { query: {"CountryCode": nameCountry},
                        limit: 1,
                        id: [["author", "DESC"]]
                      });
*/