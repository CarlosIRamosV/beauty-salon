function afterDate(date_in, search) {
    if (date_in) {
        let date = new Date(date_in);
        date.setDate(date.getDate() + 1);
        search.after_date = date.getTime().toString();
    }
}

function beforeDate(date_in, search) {
    if (date_in) {
        let date = new Date(date_in);
        date.setDate(date.getDate() + 1);
        search.before_date = date.getTime().toString();
    }
}

export { afterDate, beforeDate}