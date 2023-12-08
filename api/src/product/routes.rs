use crate::product::actions;
use crate::product::models::{NewProduct, UpdateProduct};
use crate::Pool;
use actix_web::{delete, error, get, post, put, web, HttpResponse, Responder};
use uuid::Uuid;

#[get("/products")]
pub async fn get_products(pool: web::Data<Pool>) -> actix_web::Result<impl Responder> {
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

#[delete("/products/{product_id}")]
pub async fn delete_product(
    pool: web::Data<Pool>,
    product_uid: web::Path<Uuid>,
) -> actix_web::Result<impl Responder> {
    let product_uid = product_uid.into_inner();
    let message = web::block(move || {
        let mut conn = pool.get()?;
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
    form: web::Json<UpdateProduct>,
) -> actix_web::Result<impl Responder> {
    let product_uid = product_uid.into_inner();
    let product = web::block(move || {
        let mut conn = pool.get()?;
        actions::update_product_by_uid(
            &mut conn,
            product_uid,
            &form.name,
            &form.description,
            form.price,
            form.stock,
            &form.image,
        )
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(product))
}

#[post("/products")]
pub async fn add_product(
    pool: web::Data<Pool>,
    form: web::Json<NewProduct>,
) -> actix_web::Result<impl Responder> {
    let product = web::block(move || {
        let mut conn = pool.get()?;
        actions::insert_new_product(
            &mut conn,
            &form.name,
            &form.description,
            form.price,
            form.stock,
            &form.image,
        )
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Created().json(product))
}
