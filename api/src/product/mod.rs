use actix_web::{error, get, HttpResponse, post, Responder, web};
use uuid::Uuid;

use crate::models;
use crate::models::types::Pool;

mod actions;

#[get("/products")]
pub async fn get_products(
    pool: web::Data<Pool>,
) -> actix_web::Result<impl Responder> {
    let products = web::block(move || {
        let mut conn = pool.get()?;
        actions::find_all_products(&mut conn)
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

#[post("/products")]
pub async fn add_product(
    pool: web::Data<Pool>,
    form: web::Json<models::products::NewProduct>,
) -> actix_web::Result<impl Responder> {
    let product = web::block(move || {
        let mut conn = pool.get()?;
        actions::insert_new_product(&mut conn, &form.name, &form.description, form.price, form.quantity, &form.image)
    })
        .await?
        .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Created().json(product))
}