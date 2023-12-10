use crate::appointment::models::{Appointment, New, Public, Search, Update};
use diesel::{ExpressionMethods, OptionalExtension, QueryDsl, RunQueryDsl, SqliteConnection};
use uuid::Uuid;

pub fn find_appointment_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
) -> Result<Option<Appointment>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::appointments::dsl::*;

    let appointment = appointments
        .filter(id.eq(uid.to_string()))
        .first::<Appointment>(conn)
        .optional()?;

    Ok(appointment)
}

pub fn find_all_appointments(
    conn: &mut SqliteConnection,
) -> Result<Vec<Public>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::appointments::dsl::*;

    let appointment = appointments.load::<Appointment>(conn)?;

    let list_public_appointments = generate_public_appointments(conn, appointment).unwrap();

    Ok(list_public_appointments)
}

pub fn find_all_user_appointments(
    conn: &mut SqliteConnection,
    uid: Uuid,
) -> Result<Vec<Public>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::appointments::dsl::*;

    let appointment = appointments
        .filter(client_id.eq(uid.to_string()))
        .load::<Appointment>(conn)?;

    let list_public_appointments = generate_public_appointments(conn, appointment).unwrap();

    Ok(list_public_appointments)
}

// Search appointments
pub fn find_appointments(
    conn: &mut SqliteConnection,
    search: Search,
) -> Result<Vec<Public>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::appointments;

    let appointment = appointments::table.into_boxed();

    let appointment = match search.client_id {
        Some(client_id) => appointment.filter(appointments::dsl::client_id.eq(client_id)),
        None => appointment,
    };

    let appointment = match search.employee_id {
        Some(employee_id) => appointment.filter(appointments::dsl::employee_id.eq(employee_id)),
        None => appointment,
    };

    let appointment = match search.after_date {
        Some(after_date) => appointment.filter(appointments::dsl::date.le(after_date)),
        None => appointment,
    };

    let appointment = match search.before_date {
        Some(before_date) => appointment.filter(appointments::dsl::date.ge(before_date)),
        None => appointment,
    };

    let appointment = appointment.load::<Appointment>(conn)?;

    let list_public_appointments = generate_public_appointments(conn, appointment).unwrap();

    Ok(list_public_appointments)
}

pub fn delete_appointment_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
) -> Result<Option<()>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::appointments::dsl::*;

    let old_count = appointments.count().get_result::<i64>(conn)?;
    diesel::delete(appointments.filter(id.eq(uid.to_string()))).execute(conn)?;
    assert!(old_count > appointments.count().get_result::<i64>(conn)?);

    Ok(Option::from(()))
}

pub fn insert_new_appointment(
    conn: &mut SqliteConnection,
    new: New,
) -> Result<Appointment, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::appointments::dsl::*;

    let new_appointment = Appointment {
        id: Uuid::new_v4().to_string(),
        client_id: new.client_id,
        services: new.services,
        employee_id: new.employee_id,
        date: new.date,
    };

    diesel::insert_into(appointments)
        .values(&new_appointment)
        .execute(conn)?;

    Ok(new_appointment)
}

pub fn update_appointment_by_uid(
    conn: &mut SqliteConnection,
    uid: Uuid,
    update: Update,
) -> Result<Appointment, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::appointments::dsl::*;

    // Check if appointment exists
    let appointment = find_appointment_by_uid(conn, uid)?;

    let mut appointment = match appointment {
        Some(appointment) => appointment,
        None => return Err("No user found".into()),
    };

    // Update appointment
    if let Some(new_client) = update.client_id {
        appointment.client_id = new_client.to_owned();
    }

    if let Some(new_services) = update.services {
        appointment.services = new_services.to_owned();
    }

    if let Some(new_employee) = update.employee_id {
        appointment.employee_id = new_employee.to_owned();
    }

    if let Some(new_date) = update.date {
        appointment.date = new_date.to_owned();
    }

    // Update appointment
    diesel::update(appointments.filter(id.eq(uid.to_string())))
        .set((
            client_id.eq(&appointment.client_id),
            services.eq(&appointment.services),
            employee_id.eq(&appointment.employee_id),
            date.eq(&appointment.date),
        ))
        .execute(conn)?;

    Ok(appointment)
}

pub fn generate_public_appointment(
    conn: &mut SqliteConnection,
    appointment: Appointment,
) -> Result<Public, Box<dyn std::error::Error + Send + Sync>> {
    let client = crate::user::actions::find_user_by_uid(
        conn,
        Uuid::parse_str(&appointment.client_id).unwrap(),
    )
    .unwrap();
    let employee = crate::user::actions::find_user_by_uid(
        conn,
        Uuid::parse_str(&appointment.employee_id).unwrap(),
    )
    .unwrap();
    Ok(Public {
        id: appointment.id.to_owned(),
        client_id: appointment.client_id.to_owned(),
        client_name: client.clone().unwrap().name.to_owned(),
        client_last_name: client.clone().unwrap().last_name.to_owned(),
        client_phone: client.clone().unwrap().phone.to_owned(),
        services: appointment.services.to_owned(),
        employee_id: appointment.employee_id.to_owned(),
        employee_name: employee.clone().unwrap().name.to_owned(),
        employee_last_name: employee.clone().unwrap().last_name.to_owned(),
        date: appointment.date.to_owned(),
    })
}

pub fn generate_public_appointments(
    conn: &mut SqliteConnection,
    appointments: Vec<Appointment>,
) -> Result<Vec<Public>, Box<dyn std::error::Error + Send + Sync>> {
    let list_public_appointments: Vec<Public> = appointments
        .iter()
        .map(|appointment| generate_public_appointment(conn, appointment.to_owned()).unwrap())
        .collect();

    Ok(list_public_appointments)
}
