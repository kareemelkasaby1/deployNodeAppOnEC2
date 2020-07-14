db.createUser(
    {
        user: "admin",
        pwd: "123456",
        roles: [
            {
                role: "userAdminAnyDatabase",
                db: "admin"

            }
        ]
    }
)

db.createUser(
    {
        user: "root",
        pwd: "123456",
        roles: [
            {
                role: "root",
                db: "admin"

            }
        ]
    }
)