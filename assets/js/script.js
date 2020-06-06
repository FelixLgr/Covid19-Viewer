function formatInt(number) {
    return new Intl.NumberFormat().format(number)
}

function hreftocountry(idpays) {
    window.location = "./#/infos/"+idpays;
}

function _(id) {
    return document.getElementById(id)
}