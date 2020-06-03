function formatInt(number) {
    return new Intl.NumberFormat().format(number)
}

function _(id) {
    return document.getElementById(id)
}