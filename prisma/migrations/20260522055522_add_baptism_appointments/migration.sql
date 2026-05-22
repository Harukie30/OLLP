-- CreateTable
CREATE TABLE "baptism_appointments" (
    "id_user" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "child_name" TEXT NOT NULL,
    "intended_date" TEXT,
    "message" TEXT,
    "submitted_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "accepted_at" DATETIME
);
