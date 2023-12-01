use actix_web::{error, get, HttpResponse, post, Responder, web};
use diesel::{r2d2, SqliteConnection};
use diesel::r2d2::Pool;
use uuid::Uuid;

use crate::models;

mod actions;

#[get("/product")]
pub async fn get_products(
    pool: web::Data<Pool<r2d2::ConnectionManager<SqliteConnection>>>,
) -> actix_web::Result<impl Responder> {
    // use web::block to offload blocking Diesel queries without blocking server thread
    let products = web::block(move || {
        // note that obtaining a connection from the pool is also potentially blocking
        let mut conn = pool.get()?;

        actions::find_all_products(&mut conn)
    })
        .await?
        // map diesel query errors to a 500 error response
        .map_err(error::ErrorInternalServerError)?;

    Ok(HttpResponse::Ok().json(products))
}

#[get("/product/{product_id}")]
pub async fn get_product(
    pool: web::Data<Pool<r2d2::ConnectionManager<SqliteConnection>>>,
    product_uid: web::Path<Uuid>,
) -> actix_web::Result<impl Responder> {
    let product_uid = product_uid.into_inner();

    // use web::block to offload blocking Diesel queries without blocking server thread
    let product = web::block(move || {
        // note that obtaining a connection from the pool is also potentially blocking
        let mut conn = pool.get()?;

        actions::find_product_by_uid(&mut conn, product_uid)
    })
        .await?
        // map diesel query errors to a 500 error response
        .map_err(error::ErrorInternalServerError)?;

    Ok(match product {
        // user was found; return 200 response with JSON formatted user object
        Some(product) => HttpResponse::Ok().json(product),

        // user was not found; return 404 response with error message
        None => HttpResponse::NotFound().body(format!("No product found with UID: {product_uid}")),
    })
}

#[post("/product")]
pub async fn add_product(
    pool: web::Data<Pool<r2d2::ConnectionManager<SqliteConnection>>>,
    form: web::Json<models::products::NewProduct>,
) -> actix_web::Result<impl Responder> {
    // use web::block to offload blocking Diesel queries without blocking server thread
    let product = web::block(move || {
        // note that obtaining a connection from the pool is also potentially blocking
        let mut conn = pool.get()?;

        actions::insert_new_product(&mut conn, &form.name, &form.description, form.price, form.quantity, &form.image)
    })
        .await?
        // map diesel query errors to a 500 error response
        .map_err(error::ErrorInternalServerError)?;

    // user was added successfully; return 201 response with new user info
    Ok(HttpResponse::Created().json(product))
}