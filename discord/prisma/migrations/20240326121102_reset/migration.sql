-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT,
    "lastName" TEXT,
    "name" TEXT,
    "userName" TEXT,
    "password" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "phoneNumber" TEXT,
    "image" TEXT
);
INSERT INTO "new_User" ("email", "emailVerified", "firstName", "id", "image", "lastName", "password", "phoneNumber", "userName") SELECT "email", "emailVerified", "firstName", "id", "image", "lastName", "password", "phoneNumber", "userName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
