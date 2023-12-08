use actix_web::{error, get, post, web, HttpResponse, Responder, HttpRequest};
use actix_web::http::header::Header;
use actix_web_httpauth::headers::authorization::{Authorization, Bearer};
use uuid::Uuid;

use crate::resources::actions;
use crate::resources::models::New;
use crate::{auth, Pool};

#[get("/images/{image_id}")]
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

#[post("/images")]
pub async fn add_image(
    pool: web::Data<Pool>,
    form: web::Json<New>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let image = web::block(move || {
        let mut conn = pool.get()?;

        // Check if user is admin or employee or user
        let is_admin_or_employee_or_user = auth::actions::is_admin_or_employee_or_user(&mut conn, auth.as_ref().token())?;

        if !is_admin_or_employee_or_user {
            return Err("Unauthorized".into());
        }

        actions::insert_new_image(&mut conn, &form.image)
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Created().json(image))
}
