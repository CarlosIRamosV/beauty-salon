use crate::appointment::models::{Appointment, New, Search, Update};
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
    search: Search,
) -> Result<Vec<Appointment>, Box<dyn std::error::Error + Send + Sync>> {
    use crate::schema::appointments;

    let mut appointments = appointments::table::into_boxed(Default::default());

    if let Some(client_id) = search.client_id {
        appointments = appointments.filter(appointments::client_id.eq(client_id));
    }

    if let Some(employee_id) = search.employee_id {
        appointments = appointments.filter(appointments::employee_id.eq(employee_id));
    }

    if let Some(date) = search.date {
        appointments = appointments.filter(appointments::date.eq(date));
    }

    let appointment = appointments.load::<Appointment>(conn)?;

    // Check if appointment is empty
    if appointment.is_empty() {
        return Err("No appointment found".into());
    }

    Ok(appointment)
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
