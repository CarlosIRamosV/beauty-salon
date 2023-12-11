use actix_web::{delete, error, HttpRequest, HttpResponse, post, Responder, web};
use actix_web::http::header::Header;
use actix_web_httpauth::headers::authorization::{Authorization, Bearer};
use crate::{auth, Pool};
use crate::favorites::actions;
use crate::favorites::models::New;

#[post("/favorites")]
pub async fn add_favorite(
    pool: web::Data<Pool>,
    form: web::Json<New>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let favorite = web::block(move || {
        let mut conn = pool.get()?;

        // Check if user is admin or employee
        let is_admin_or_employee_or_user =
            auth::actions::is_admin_or_employee_or_user(&mut conn, auth.as_ref().token())?;

        if !is_admin_or_employee_or_user {
            return Err("Unauthorized".into());
        }

        let user_id = auth::actions::get_user_id(&mut conn, auth.as_ref().token())?;

        actions::insert_new_favorite(
            &mut conn, New {
                user_id: Some(user_id),
                product_id: form.clone().product_id,
            }
        )
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Created().json(favorite))
}

#[delete("/favorites/{id}")]
pub async fn delete_favorite(
    pool: web::Data<Pool>,
    id: web::Path<String>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let favorite = web::block(move || {
        let mut conn = pool.get()?;

        // Check if user is admin or employee
        let is_admin_or_employee_or_user =
            auth::actions::is_admin_or_employee_or_user(&mut conn, auth.as_ref().token())?;

        if !is_admin_or_employee_or_user {
            return Err("Unauthorized".into());
        }

        let user_id = auth::actions::get_user_id(&mut conn, auth.as_ref().token())?;

        actions::delete_favorite_by_uid(
            &mut conn,
            user_id,
            id.clone(),
        )
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(favorite))
}