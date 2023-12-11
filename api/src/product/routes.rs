use actix_web::http::header::Header;
use actix_web::{delete, error, get, post, put, web, HttpRequest, HttpResponse, Responder};
use actix_web_httpauth::headers::authorization::{Authorization, Bearer};
use uuid::Uuid;

use crate::product::actions;
use crate::product::models::{New, Search, Update};
use crate::{auth, Pool};

#[get("/products")]
pub async fn get_all_products(pool: web::Data<Pool>) -> actix_web::Result<impl Responder> {
    let products = web::block(move || {
        let mut conn = pool.get()?;
        actions::find_all_products(&mut conn)
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(products))
}

#[get("/products/favorites")]
pub async fn get_all_products_with_favorite(
    pool: web::Data<Pool>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let products = web::block(move || {
        let mut conn = pool.get()?;

        // Check if user is admin or employee or user
        let is_admin_or_employee_or_user =
            auth::actions::is_admin_or_employee_or_user(&mut conn, auth.as_ref().token())?;

        if !is_admin_or_employee_or_user {
            return Err("Unauthorized".into());
        }

        let user_id = auth::actions::get_user_id(&mut conn, auth.as_ref().token())?;

        actions::find_all_products_with_favorite(&mut conn, user_id)
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(products))
}

#[post("/products/search")]
pub async fn get_products(
    pool: web::Data<Pool>,
    form: web::Json<Search>,
) -> actix_web::Result<impl Responder> {
    let products = web::block(move || {
        let mut conn = pool.get()?;

        return actions::find_products(&mut conn, form.clone());
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(products))
}

#[get("/products/{product_id}")]
pub async fn get_product(
    pool: web::Data<Pool>,
    product_uid: web::Path<Uuid>,
) -> actix_web::Result<impl Responder> {
    let product_uid = product_uid.into_inner();
    let product = web::block(move || {
        let mut conn = pool.get()?;
        actions::find_product_by_uid(&mut conn, product_uid)
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(match product {
        Some(product) => HttpResponse::Ok().json(product),
        None => HttpResponse::NotFound().body(format!("No product found with UID: {product_uid}")),
    })
}

#[delete("/products/{product_id}")]
pub async fn delete_product(
    pool: web::Data<Pool>,
    product_uid: web::Path<Uuid>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let product_uid = product_uid.into_inner();
    let message = web::block(move || {
        let mut conn = pool.get()?;

        // Check if user is admin or employee
        let is_admin_or_employee =
            auth::actions::is_admin_or_employee(&mut conn, auth.as_ref().token())?;

        if !is_admin_or_employee {
            return Err("Unauthorized".into());
        }

        actions::delete_product_by_uid(&mut conn, product_uid)
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(match message {
        Some(message) => HttpResponse::Ok().json(message),
        None => HttpResponse::NotFound().body(format!("No product found with UID: {product_uid}")),
    })
}

#[put("/products/{product_id}")]
pub async fn update_product(
    pool: web::Data<Pool>,
    product_uid: web::Path<Uuid>,
    form: web::Json<Update>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let product_uid = product_uid.into_inner();
    let product = web::block(move || {
        let mut conn = pool.get()?;

        // Check if user is admin or employee
        let is_admin_or_employee =
            auth::actions::is_admin_or_employee(&mut conn, auth.as_ref().token())?;

        if !is_admin_or_employee {
            return Err("Unauthorized".into());
        }

        actions::update_product_by_uid(&mut conn, product_uid, form.clone())
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(product))
}

#[post("/products")]
pub async fn add_product(
    pool: web::Data<Pool>,
    form: web::Json<New>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let product = web::block(move || {
        let mut conn = pool.get()?;

        // Check if user is admin or employee
        let is_admin_or_employee =
            auth::actions::is_admin_or_employee(&mut conn, auth.as_ref().token())?;

        if !is_admin_or_employee {
            return Err("Unauthorized".into());
        }

        actions::insert_new_product(&mut conn, form.clone())
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Created().json(product))
}
