use crate::user::actions;
use crate::user::models::{New, Search, Update};
use crate::{auth, Pool};
use actix_web::http::header::Header;
use actix_web::{delete, error, get, post, put, web, HttpRequest, HttpResponse, Responder};
use actix_web_httpauth::headers::authorization::{Authorization, Bearer};
use uuid::Uuid;

#[get("/users/{user_id}")]
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

#[get("/users")]
pub async fn get_all_users(
    pool: web::Data<Pool>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let users = web::block(move || {
        let mut conn = pool.get()?;

        // Check if user is admin or employee
        let is_admin_or_employee =
            auth::actions::is_admin_or_employee(&mut conn, auth.as_ref().token())?;

        if is_admin_or_employee {
            return actions::find_all_users(&mut conn);
        }

        let is_user = auth::actions::is_user(&mut conn, auth.as_ref().token())?;

        if is_user {
            let user_id = auth::actions::get_user_id(&mut conn, auth.as_ref().token())?;
            return actions::find_user_and_employee(&mut conn, Uuid::parse_str(&user_id).unwrap());
        }

        Err("Unauthorized".into())
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(users))
}

#[post("/users/search")]
pub async fn get_users(
    pool: web::Data<Pool>,
    form: web::Json<Search>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let users = web::block(move || {
        let mut conn = pool.get()?;

        // Check if user is admin or employee
        let is_admin_or_employee =
            auth::actions::is_admin_or_employee(&mut conn, auth.as_ref().token())?;

        if !is_admin_or_employee {
            return Err("Unauthorized".into());
        }

        actions::find_users(&mut conn, form.clone())
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(users))
}

#[post("/users")]
pub async fn add_user(
    pool: web::Data<Pool>,
    form: web::Json<New>,
) -> actix_web::Result<impl Responder> {
    let user = web::block(move || {
        let mut conn = pool.get()?;

        actions::insert_new_user(&mut conn, form.clone())
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Created().json(user))
}

#[put("/users/{user_id}")]
pub async fn update_user(
    pool: web::Data<Pool>,
    user_uid: web::Path<Uuid>,
    form: web::Json<Update>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let user_uid = user_uid.into_inner();
    let user = web::block(move || {
        let mut conn = pool.get()?;

        // Check if user is admin
        let is_admin = auth::actions::is_admin_or_employee(&mut conn, auth.as_ref().token())?;

        if is_admin {
            return actions::update_user_by_uid(&mut conn, user_uid, form.clone(), true);
        }

        // Check if user is employee
        let is_employee = auth::actions::is_admin_or_employee(&mut conn, auth.as_ref().token())?;

        if is_employee {
            return actions::update_user_by_uid(&mut conn, user_uid, form.clone(), false);
        }

        // Check if user is user
        let is_user = auth::actions::is_user(&mut conn, auth.as_ref().token())?;

        if is_user {
            let user_id = auth::actions::get_user_id(&mut conn, auth.as_ref().token())?;

            if user_id == user_uid.to_string() {
                return actions::update_user_by_uid(&mut conn, user_uid, form.clone(), false);
            }
        }
        return Err("Unauthorized".into());
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(user))
}

#[delete("/users/{user_id}")]
pub async fn delete_user(
    pool: web::Data<Pool>,
    user_uid: web::Path<Uuid>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let user_uid = user_uid.into_inner();
    let delete = web::block(move || {
        let mut conn = pool.get()?;

        // Check if user is admin or employee
        let is_admin_or_employee =
            auth::actions::is_admin_or_employee(&mut conn, auth.as_ref().token())?;

        if is_admin_or_employee {
            return actions::delete_user_by_uid(&mut conn, user_uid);
        }

        let is_user = auth::actions::is_user(&mut conn, auth.as_ref().token())?;

        if is_user {
            let user_id = auth::actions::get_user_id(&mut conn, auth.as_ref().token())?;

            if user_id == user_uid.to_string() {
                return actions::delete_user_by_uid(&mut conn, user_uid);
            }
        }
        Err("Unauthorized".into())
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(delete))
}
