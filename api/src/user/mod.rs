use actix_web::web;

pub(crate) mod actions;
pub mod models;
mod routes;

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(routes::add_user);
    cfg.service(routes::get_user);
    cfg.service(routes::get_all_users);
    cfg.service(routes::get_users);
    cfg.service(routes::update_user);
    cfg.service(routes::delete_user);
}
