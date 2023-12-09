use actix_web::web;

mod actions;
mod models;
mod routes;

pub fn init_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(routes::add_product);
    cfg.service(routes::delete_product);
    cfg.service(routes::get_product);
    cfg.service(routes::get_all_products);
    cfg.service(routes::get_products);
    cfg.service(routes::update_product);
}
