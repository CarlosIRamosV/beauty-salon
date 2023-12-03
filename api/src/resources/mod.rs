use actix_web::{error, get, HttpResponse, post, Responder, web};
use uuid::Uuid;

use crate::models::images::NewImage;
use crate::models::types::Pool;

pub mod actions;

#[get("/image/{image_id}")]
pub async fn get_image(
    pool: web::Data<Pool>,
    image_uid: web::Path<Uuid>,
) -> actix_web::Result<impl Responder> {
    let image_uid = image_uid.into_inner();
    let image = web::block(move || {
        let mut conn = pool.get()?;
        actions::find_image_by_uid(&mut conn, image_uid)
    })
        .await?
        .map_err(error::ErrorInternalServerError)?;
    Ok(match image {
        Some(image) => HttpResponse::build(actix_web::http::StatusCode::OK)
            .content_type(image.format)
            .body(image.data),
        None => HttpResponse::NotFound().body(format!("No image found with UID: {image_uid}")),
    })
}

#[post("/image")]
pub async fn add_image(
    pool: web::Data<Pool>,
    form: web::Json<NewImage>,
) -> actix_web::Result<impl Responder> {
    let image = web::block(move || {
        let mut conn = pool.get()?;
        actions::insert_new_image(&mut conn, &form.image)
    })
        .await?
        .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Created().json(image))
}