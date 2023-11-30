// @generated automatically by Diesel CLI.

diesel::table! {
    users (id) {
        id -> Text,
        name -> Text,
        last_name -> Text,
        birth_date -> Date,
        sex -> Text,
        phone -> Text,
        email -> Text,
        password -> Text,
    }
}
