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
    passwords (user_id) {
        user_id -> Text,
        password -> Text,
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
    roles (id) {
        id -> Integer,
        description -> Text,
    }
}

diesel::table! {
    sex (id) {
        id -> Integer,
        description -> Text,
    }
}

diesel::table! {
    users (id) {
        id -> Text,
        role_id -> Integer,
        name -> Text,
        last_name -> Text,
        birth_date -> Date,
        sex_id -> Integer,
        phone -> Text,
        email -> Text,
    }
}

diesel::joinable!(jwt -> users (user_id));
diesel::joinable!(passwords -> users (user_id));
diesel::joinable!(products -> images (image_id));
diesel::joinable!(users -> roles (role_id));
diesel::joinable!(users -> sex (sex_id));

diesel::allow_tables_to_appear_in_same_query!(images, jwt, passwords, products, roles, sex, users,);