import {getUser} from "../api.config.js";

function validate(subdirectory) {
    let directory = "../"
    if (subdirectory) {
        directory = "../../"
    }
    try {
        let user = getUser();
        if (user.type !== "Admin" && user.type !== "Employee") {
            return window.location.href = directory + "index.html";
        }
    } catch (error) {

        if (error.message === "User is not logged in") {
            return window.location.href = directory + "sign/in.html";
        }

        setTimeout(function () {
            return window.location.reload();
        }, 250);
    }

}

export {validate};