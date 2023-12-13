function dateInput(after, before, search) {
    if (before) {
        let date = new Date(before);
        date.setDate(date.getDate() + 1);
        search.before_date = date.getTime().toString();
    }
    if (after) {
        let date = new Date(after);
        date.setDate(date.getDate() + 1);
        search.after_date = date.getTime().toString();
    }
    return search;
}


export {dateInput};