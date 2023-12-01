// @generated automatically by Diesel CLI.

diesel::table! {
    products (id) {
        id -> Text,
        name -> Text,
        description -> Text,
        price -> Double,
        quantity -> Integer,
        image -> Text,
    }
}

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

diesel::allow_tables_to_appear_in_same_query!(
    products,
    users,
);
