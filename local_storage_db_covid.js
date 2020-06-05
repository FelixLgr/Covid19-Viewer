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
    covid.createTable("EvolutionCountries", ["CountryCode", "NewConfirmed", "TotalConfirmed", "NewDeaths", "TotalDeaths", "NewRecovered", "TotalRecovered", "Date"]);
    console.log("Table créée => " + "EvolutionCountries");    



    // create the "Countries" table
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

    const paramUpdate = selectLastDateEvo(codeCountry);



    var settings = {
        "url": apiUrl,
        "method": "GET",
        "timeout": 0,
        async: false
    };
    $.ajax(settings).done(function (response) {
        if (paramUpdate === false) {
            let NMoinsUnConfirmed = 0;
            let NMoinsUnDeaths = 0;
            let NMoinsUnRecovered = 0;
            response.forEach(element => {
                covid.insert("EvolutionCountries", {
                    
                    CountryCode: codeCountry,
                    NewConfirmed: (element.Confirmed - NMoinsUnConfirmed),
                    TotalConfirmed: element.Confirmed,
                    NewDeaths: (element.Deaths - NMoinsUnDeaths),
                    TotalDeaths: element.Deaths,
                    NewRecovered: (element.Recovered - NMoinsUnRecovered),
                    TotalRecovered: element.Recovered,
                    Date: element.Date
                });
                
                NMoinsUnConfirmed = element.Confirmed;
                NMoinsUnDeaths = element.Deaths;
                NMoinsUnRecovered = element.Recovered;

                covid.commit();
            });
        } else {
            let lastDate = new Date(paramUpdate);
            let NMoinsUnConfirmed = 0;
            let NMoinsUnDeaths = 0;
            let NMoinsUnRecovered = 0;
            response.forEach(element => {
                let elemDate = new Date(element.Date);
                if (lastDate < elemDate) {
                    covid.insert("EvolutionCountries", {
                        CountryCode: codeCountry,
                        NewConfirmed: (element.Confirmed - NMoinsUnConfirmed),
                        TotalConfirmed: element.Confirmed,
                        NewDeaths: (element.Deaths - NMoinsUnDeaths),
                        TotalDeaths: element.Deaths,
                        NewRecovered: (element.Recovered - NMoinsUnRecovered),
                        TotalRecovered: element.Recovered,
                        Date: element.Date
                    });
                    
                    NMoinsUnConfirmed = element.Confirmed;
                    NMoinsUnDeaths = element.Deaths;
                    NMoinsUnRecovered = element.Recovered;
                    covid.commit();
                }
            });
        }
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

selectLastDateEvo = (countryCode) => {
    // Initialise. If the database doesn't exist, it is created
    let covid = new localStorageDB("covid", localStorage);

    const resQuery = covid.queryAll("EvolutionCountries", {
        query: {
            "CountryCode": countryCode
        },
        limit: 1,
        sort: [
            ["ID", "DESC"]
        ]
    });
    if (resQuery.length === 0) {
        return false;
    } else {
        return resQuery[0].Date;
    }
}