use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

use crate::schema::appointments;

#[derive(Debug, Clone, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = appointments)]
pub struct Appointment {
    pub id: String,
    pub client_id: String,
    pub services: String,
    pub employee_id: String,
    pub date: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct New {
    pub client_id: String,
    pub services: String,
    pub employee_id: String,
    pub date: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Update {
    pub client_id: Option<String>,
    pub services: Option<String>,
    pub employee_id: Option<String>,
    pub date: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Search {
    pub client_id: Option<String>,
    pub employee_id: Option<String>,
    pub after_date: Option<String>,
    pub before_date: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Public {
    pub id: String,
    pub client_id: String,
    pub client_name: String,
    pub client_last_name: String,
    pub client_phone: String,
    pub services: String,
    pub employee_id: String,
    pub employee_name: String,
    pub employee_last_name: String,
    pub date: String,
}
