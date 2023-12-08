// @generated automatically by Diesel CLI.

diesel::table! {
    images (id) {
        id -> Text,
        format -> Text,
        data -> Binary,
        hash -> Text,
    }
}

diesel::table! {
    jwt (id) {
        id -> Text,
        user_id -> Text,
        token -> Text,
        expiration_date -> Date,
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
        name -> Text,
        last_name -> Text,
        birth_date -> Date,
        sex -> Text,
        phone -> Text,
        email -> Text,
        password -> Text,
    }
}

diesel::joinable!(jwt -> users (user_id));
diesel::joinable!(products -> images (image_id));

diesel::allow_tables_to_appear_in_same_query!(
    images,
    jwt,
    products,
    users,
);
