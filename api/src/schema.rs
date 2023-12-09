// @generated automatically by Diesel CLI.

diesel::table! {
    appointments (id) {
        id -> Text,
        client_id -> Text,
        services -> Text,
        employee_id -> Text,
        date -> Date,
    }
}

diesel::table! {
    images (id) {
        id -> Text,
        format -> Text,
        data -> Binary,
        hash -> Text,
    }
}

diesel::table! {
    products (id) {
        id -> Text,
        name -> Text,
        description -> Text,
        price -> Double,
        stock -> Integer,
        image_id -> Nullable<Text>,
    }
}

diesel::table! {
    users (id) {
        id -> Text,
        #[sql_name = "type"]
        type_ -> Text,
        image_id -> Nullable<Text>,
        name -> Text,
        last_name -> Text,
        birth_date -> Date,
        sex -> Text,
        phone -> Text,
        email -> Text,
        password_hash -> Text,
    }
}

diesel::joinable!(products -> images (image_id));
diesel::joinable!(users -> images (image_id));

diesel::allow_tables_to_appear_in_same_query!(appointments, images, products, users,);
