use actix_web::{error, get, HttpResponse, post, Responder, web};
use diesel::{r2d2, SqliteConnection};
use diesel::r2d2::Pool;
use uuid::Uuid;

use crate::models;

mod actions;

#[get("/user/{user_id}")]
pub async fn get_user(
    pool: web::Data<Pool<r2d2::ConnectionManager<SqliteConnection>>>,
    user_uid: web::Path<Uuid>,
) -> actix_web::Result<impl Responder> {
    let user_uid = user_uid.into_inner();

    // use web::block to offload blocking Diesel queries without blocking server thread
    let user = web::block(move || {
        // note that obtaining a connection from the pool is also potentially blocking
        let mut conn = pool.get()?;

        actions::find_user_by_uid(&mut conn, user_uid)
    })
        .await?
        // map diesel query errors to a 500 error response
        .map_err(error::ErrorInternalServerError)?;

    Ok(match user {
        // user was found; return 200 response with JSON formatted user object
        Some(user) => HttpResponse::Ok().json(user),

        // user was not found; return 404 response with error message
        None => HttpResponse::NotFound().body(format!("No user found with UID: {user_uid}")),
    })
}

#[post("/user")]
pub async fn add_user(
    pool: web::Data<Pool<r2d2::ConnectionManager<SqliteConnection>>>,
    form: web::Json<models::user::NewUser>,
) -> actix_web::Result<impl Responder> {
    // use web::block to offload blocking Diesel queries without blocking server thread
    let user = web::block(move || {
        // note that obtaining a connection from the pool is also potentially blocking
        let mut conn = pool.get()?;

        actions::insert_new_user(&mut conn, &form.name, &form.last_name, &form.birth_date, form.sex, &form.phone, &form.email, &form.password)
    })
        .await?
        // map diesel query errors to a 500 error response
        .map_err(error::ErrorInternalServerError)?;

    // user was added successfully; return 201 response with new user info
    Ok(HttpResponse::Created().json(user))
}