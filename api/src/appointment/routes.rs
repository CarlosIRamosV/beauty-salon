use crate::appointment::actions;
use crate::appointment::models::{New, Search, Update};
use crate::{auth, Pool};
use actix_web::http::header::Header;
use actix_web::{delete, error, get, post, web, HttpRequest, HttpResponse, Responder, put};
use actix_web_httpauth::headers::authorization::{Authorization, Bearer};
use uuid::Uuid;

#[get("/appointments")]
pub async fn get_all_appointments(
    pool: web::Data<Pool>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let appointments = web::block(move || {
        let mut conn = pool.get()?;
        let is_admin_or_employee =
            auth::actions::is_admin_or_employee(&mut conn, auth.as_ref().token())?;

        if is_admin_or_employee {
            return actions::find_all_appointments(&mut conn);
        }

        let is_user = auth::actions::is_user(&mut conn, auth.as_ref().token())?;

        if is_user {
            let user_id = auth::actions::get_user_id(&mut conn, auth.as_ref().token())?;

            return actions::find_all_user_appointments(
                &mut conn,
                Uuid::parse_str(&user_id).unwrap(),
            );
        }
        return Err("Unauthorized".into());
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(appointments))
}

#[post("/appointments/search")]
pub async fn get_appointments(
    pool: web::Data<Pool>,
    form: web::Json<Search>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let appointments = web::block(move || {
        let mut conn = pool.get()?;
        let is_admin_or_employee =
            auth::actions::is_admin_or_employee(&mut conn, auth.as_ref().token())?;

        if is_admin_or_employee {
            return actions::find_appointments(&mut conn, form.into_inner());
        }

        let is_user = auth::actions::is_user(&mut conn, auth.as_ref().token())?;

        if is_user {
            let user_id = auth::actions::get_user_id(&mut conn, auth.as_ref().token())?;

            return actions::find_appointments(
                &mut conn,
                Search {
                    client_id: Option::from(user_id),
                    ..form.into_inner()
                },
            );
        }
        return Err("Unauthorized".into());
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(appointments))
}

#[get("/appointments/{id}")]
pub async fn get_appointment_by_id(
    pool: web::Data<Pool>,
    id: web::Path<Uuid>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let appointment = web::block(move || {
        let mut conn = pool.get()?;
        let is_admin_or_employee =
            auth::actions::is_admin_or_employee(&mut conn, auth.as_ref().token())?;

        if is_admin_or_employee {
            return actions::find_appointment_by_uid(&mut conn, id.clone());
        }

        let is_user = auth::actions::is_user(&mut conn, auth.as_ref().token())?;

        if is_user {
            return actions::find_appointment_by_uid(&mut conn, id.clone());
        }
        return Err("Unauthorized".into());
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(appointment))
}

#[post("/appointments")]
pub async fn add_appointment(
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

        if is_admin_or_employee {
            return actions::insert_new_appointment(&mut conn, form.into_inner());
        }

        let is_user = auth::actions::is_user(&mut conn, auth.as_ref().token())?;

        if is_user {
            let user_id = auth::actions::get_user_id(&mut conn, auth.as_ref().token())?;

            return actions::insert_new_appointment(
                &mut conn,
                New {
                    client_id: user_id,
                    ..form.into_inner()
                },
            );
        }
        return Err("Unauthorized".into());
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Created().json(product))
}

#[put("/appointments/{id}")]
pub async fn update_appointment_by_id(
    pool: web::Data<Pool>,
    id: web::Path<String>,
    form: web::Json<Update>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let appointment = web::block(move || {
        let mut conn = pool.get()?;

        // Check if user is admin or employee
        let is_admin_or_employee =
            auth::actions::is_admin_or_employee(&mut conn, auth.as_ref().token())?;

        if is_admin_or_employee {
            return actions::update_appointment_by_uid(
                &mut conn,
                id.into_inner().parse().unwrap(),
                form.into_inner(),
            );
        }

        let is_user = auth::actions::is_user(&mut conn, auth.as_ref().token())?;

        if is_user {
            let user_id = auth::actions::get_user_id(&mut conn, auth.as_ref().token())?;

            return actions::update_appointment_by_uid(
                &mut conn,
                id.into_inner().parse().unwrap(),
                Update {
                    client_id: Option::from(user_id),
                    ..form.into_inner()
                },
            );
        }
        return Err("Unauthorized".into());
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(HttpResponse::Ok().json(appointment))
}

#[delete("/appointments/{id}")]
pub async fn delete_appointment_by_id(
    pool: web::Data<Pool>,
    id: web::Path<Uuid>,
    req: HttpRequest,
) -> actix_web::Result<impl Responder> {
    let auth = Authorization::<Bearer>::parse(&req)?;
    let id = id.into_inner();
    let appointment = web::block(move || {
        let mut conn = pool.get()?;

        // Check if user is admin or employee
        let is_admin_or_employee =
            auth::actions::is_admin_or_employee(&mut conn, auth.as_ref().token())?;

        if is_admin_or_employee {
            return actions::delete_appointment_by_uid(&mut conn, id.clone());
        }

        let is_user = auth::actions::is_user(&mut conn, auth.as_ref().token())?;

        if is_user {
            let user_id = auth::actions::get_user_id(&mut conn, auth.as_ref().token())?;

            let appointment = actions::find_appointment_by_uid(&mut conn, id.clone())?;

            if appointment.unwrap().client_id == user_id {
                return actions::delete_appointment_by_uid(&mut conn, id.clone());
            }
        }
        return Err("Unauthorized".into());
    })
    .await?
    .map_err(error::ErrorInternalServerError)?;
    Ok(match appointment {
        Some(appointment) => HttpResponse::Ok().json(appointment),
        None => HttpResponse::NotFound().body(format!("No appointment found with UID: {:?}", id)),
    })
}
