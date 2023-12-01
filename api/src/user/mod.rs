use actix_web::{error, get, HttpResponse, post, Responder, web};
use uuid::Uuid;

use crate::models;
use crate::models::types::Pool;

mod actions;

#[get("/user/{user_id}")]
pub async fn get_user(
    pool: web::Data<Pool>,
    user_uid: web::Path<Uuid>,
) -> actix_web::Result<impl Responder> {
    let user_uid = user_uid.into_inner();
    let user = web::block(move || {
        let mut conn = pool.get()?;
        actions::find_user_by_uid(&mut conn, user_uid)
    })
        .await?
        .map_err(error::ErrorInternalServerError)?;

    Ok(match user {
        Some(user) => HttpResponse::Ok().json(user),
        None => HttpResponse::NotFound().body(format!("No user found with UID: {user_uid}")),
    })
}

#[post("/user")]
pub async fn add_user(
    pool: web::Data<Pool>,
    form: web::Json<models::user::NewUser>,
) -> actix_web::Result<impl Responder> {
    let user = web::block(move || {
        let mut conn = pool.get()?;

        actions::insert_new_user(&mut conn, &form.name, &form.last_name, &form.birth_date, form.sex, &form.phone, &form.email, &form.password)
    })
        .await?
        .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Created().json(user))
}