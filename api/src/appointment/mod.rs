use actix_web::web;

mod actions;
mod models;
mod routes;

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(routes::get_all_appointments);
    cfg.service(routes::get_appointments);
    cfg.service(routes::get_appointment_by_id);
    cfg.service(routes::add_appointment);
    cfg.service(routes::update_appointment_by_id);
    cfg.service(routes::delete_appointment_by_id);
}
