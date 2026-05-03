-- CreateTable
CREATE TABLE "categories" (
    "categoryId" SERIAL NOT NULL,
    "name" VARCHAR,
    "isActive" BOOLEAN,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "events" (
    "eventId" SERIAL NOT NULL,
    "producerId" INTEGER NOT NULL,
    "localizationId" INTEGER NOT NULL,
    "name" VARCHAR,
    "description" TEXT,
    "coverImageUrl" VARCHAR,
    "openDate" TIMESTAMP(6),
    "startDate" TIMESTAMP(6),
    "endDate" TIMESTAMP(6),
    "isActive" BOOLEAN,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "events_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "eventsCategories" (
    "eventId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "eventsCategories_pkey" PRIMARY KEY ("eventId","categoryId")
);

-- CreateTable
CREATE TABLE "eventsLikes" (
    "userId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "eventsLikes_pkey" PRIMARY KEY ("userId","eventId")
);

-- CreateTable
CREATE TABLE "localizations" (
    "localizationId" SERIAL NOT NULL,
    "name" VARCHAR,
    "tag" VARCHAR,
    "zipCode" VARCHAR,
    "address" VARCHAR,
    "cityId" INTEGER,
    "isActive" BOOLEAN,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "localizations_pkey" PRIMARY KEY ("localizationId")
);

-- CreateTable
CREATE TABLE "localizationsCities" (
    "cityId" SERIAL NOT NULL,
    "name" VARCHAR,
    "stateId" INTEGER,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "localizationsCities_pkey" PRIMARY KEY ("cityId")
);

-- CreateTable
CREATE TABLE "localizationsStates" (
    "stateId" SERIAL NOT NULL,
    "name" VARCHAR,
    "abbreviation" VARCHAR(2),
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "localizationsStates_pkey" PRIMARY KEY ("stateId")
);

-- CreateTable
CREATE TABLE "news" (
    "newsId" SERIAL NOT NULL,
    "title" VARCHAR,
    "slug" VARCHAR,
    "content" TEXT,
    "coverImage" VARCHAR,
    "authorId" INTEGER,
    "isActive" BOOLEAN,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "news_pkey" PRIMARY KEY ("newsId")
);

-- CreateTable
CREATE TABLE "newsCategories" (
    "newsId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "newsCategories_pkey" PRIMARY KEY ("newsId","categoryId")
);

-- CreateTable
CREATE TABLE "newsEvents" (
    "newsId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "newsEvents_pkey" PRIMARY KEY ("newsId","eventId")
);

-- CreateTable
CREATE TABLE "newsTours" (
    "newsId" INTEGER NOT NULL,
    "tourId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "newsTours_pkey" PRIMARY KEY ("newsId","tourId")
);

-- CreateTable
CREATE TABLE "producers" (
    "producerId" SERIAL NOT NULL,
    "name" VARCHAR,
    "documentNumber" VARCHAR,
    "isActive" BOOLEAN,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "producers_pkey" PRIMARY KEY ("producerId")
);

-- CreateTable
CREATE TABLE "tours" (
    "tourId" SERIAL NOT NULL,
    "name" VARCHAR,
    "description" TEXT,
    "coverImageUrl" VARCHAR,
    "isActive" BOOLEAN,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "tours_pkey" PRIMARY KEY ("tourId")
);

-- CreateTable
CREATE TABLE "toursEvents" (
    "tourId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "isActive" BOOLEAN,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "toursEvents_pkey" PRIMARY KEY ("tourId","eventId")
);

-- CreateTable
CREATE TABLE "users" (
    "userId" SERIAL NOT NULL,
    "type" VARCHAR,
    "email" VARCHAR NOT NULL,
    "isActive" BOOLEAN,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "usersAdmins" (
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "usersAdmins_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "usersCredentials" (
    "credentialId" SERIAL NOT NULL,
    "userId" INTEGER,
    "provider" VARCHAR,
    "providerId" VARCHAR,
    "passwordHash" VARCHAR,
    "isActive" BOOLEAN,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "usersCredentials_pkey" PRIMARY KEY ("credentialId")
);

-- CreateTable
CREATE TABLE "usersCustomers" (
    "userId" INTEGER NOT NULL,
    "firstName" VARCHAR,
    "lastName" VARCHAR,
    "gender" VARCHAR(10),
    "birthDate" DATE,
    "cityId" INTEGER,
    "phone" VARCHAR,
    "isActive" BOOLEAN,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "usersCustomers_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "producers"("producerId") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_localizationId_fkey" FOREIGN KEY ("localizationId") REFERENCES "localizations"("localizationId") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsCategories" ADD CONSTRAINT "eventsCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("categoryId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsCategories" ADD CONSTRAINT "eventsCategories_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsLikes" ADD CONSTRAINT "eventsLikes_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventsLikes" ADD CONSTRAINT "eventsLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "localizations" ADD CONSTRAINT "localizations_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "localizationsCities"("cityId") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "localizationsCities" ADD CONSTRAINT "localizationsCities_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "localizationsStates"("stateId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "newsCategories" ADD CONSTRAINT "newsCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("categoryId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "newsCategories" ADD CONSTRAINT "newsCategories_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "news"("newsId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "newsEvents" ADD CONSTRAINT "newsEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "newsEvents" ADD CONSTRAINT "newsEvents_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "news"("newsId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "newsTours" ADD CONSTRAINT "newsTours_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "news"("newsId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "newsTours" ADD CONSTRAINT "newsTours_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("tourId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "toursEvents" ADD CONSTRAINT "toursEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("eventId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "toursEvents" ADD CONSTRAINT "toursEvents_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("tourId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usersAdmins" ADD CONSTRAINT "usersAdmins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usersCredentials" ADD CONSTRAINT "usersCredentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usersCustomers" ADD CONSTRAINT "usersCustomers_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "localizationsCities"("cityId") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usersCustomers" ADD CONSTRAINT "usersCustomers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;
