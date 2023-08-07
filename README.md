# Documentatie clothing-store-api
Ik heb een API voor shirts geschreven. Er zijn zes routes: auth, users, categories, orders, reviews en shirts.

# Deployment
Deployment: Ik heb mijn API deployed volgens het filmpje op Toledo. Mijn adres is http://34.77.228.196:3000/api/
De privatekey wordt ingesteld aan de hand van "clothing_store_jwtPrivateKey". 

# Users route
Route die wordt gebruikt voor het aanmaken/verwijderen van gebruikers, nl: de medewerkers in de clothing-store.

- POST /users Dit endpoint wordt gebruikt om een nieuwe gebruiker aan te maken. De request body moet de volgende gegevens bevatten: name, email, password en isAdmin. De eerste drie zijn verplicht, isAdmin staat default op false. 
- GET /users/me Dit endpoint wordt gebruikt om de gegevens van de ingelogde gebruiker op te halen. Inloggen gebeurt via het auth endpoint. Zodra een gebruiker is ingelogd, kan deze endpoint worden gebruikt om informatie over de ingelogde gebruiker op te halen.
- DELETE /users/:id Dit endpoint wordt gebruikt om een gebruiker te verwijderen. Het verwijderen van een gebruiker kan alleen worden gedaan door een ingelogde admin. De gebruiker die moet worden verwijderd, wordt geïdentificeerd aan de hand van het meegegeven ID in de URL.

# Auth route
Route die wordt gebruikt voor het inloggen van de gebruikers.

- POST /auth Dit endpoint wordt gebruikt om in te loggen. De request body moet de volgende gegevens bevatten: email en password. Wanneer een verzoek wordt gedaan met de juiste combinatie van e-mail en wachtwoord, genereert de API een JWT. 

# Categories route
Route die wordt gebruikt voor het aanmaken, bijwerken etc. van een categorie. 

- GET /categories Dit endpoint geeft alle beschikbare categorieën weer.
- GET /categories/:id Dit endpoint geeft de details van een specifieke categorie weer op basis van het opgegeven ID
- POST /categories Dit endpoint wordt gebruikt om een nieuwe categorie aan te maken. Body bestaat uit een naam en een beschrijving. Om dit endpoint te gebruiken, moet de gebruiker ingelogd zijn. 
- PUT /categories/:id Dit endpoint wordt gebruikt om een bestaande categorie bij te werken op basis van het opgegeven ID. De request body bestaat uit een naam en beschrijving. Om dit endpoint te gebruiken, moet de gebruiker ingelogd zijn.
- DELETE /categories/:id Dit endpoint wordt gebruikt om een bestaande categore te verwijderen op basis van het opgegeven ID. Om dit endpoint te gebruiken, moet de gebruiker een ingelogde admin zijn.

# Orders route
Route die wordt gebruikt voor het aanmaken, bijwerken, etc. van orders. Een order bestaat uit een aantal shirts en een totaalprijs. Een order staat altijd gelinkt aan een user.

- GET /orders Dit endpoint geeft alle aangemaakte orders weer van de ingelogde user weer. 
- GET /orders/:id Dit endpoint geeft een order op basis van het opgegeven ID weer van een ingelogde user weer. Om dit endpoint te gebruiken, moet de gebruiker ingelogd zijn.
- POST /orders Dit endpoint wordt gebruikt om een nieuwe order aan te maken. Body bestaat uit een user, shirts en totalprice. Om dit endpoint te gebruiken, moet de gebruiker ingelogd zijn. 
- PUT /orders Dit endpoint wordt gebruikt om een bestaande order bij te werken op basis van het opgegeven ID. Een user kan enkel zijn eigen orders bijwerken! User moet ingelogd zijn.
- DELETE Dit endpoint wordt gebruikt om een bestaande order op basis van het opgegeven ID te verwijderen. De gebruiker kan enkel zijn eigen orders verwijderen! Gebruiker moet ingelogde admin zijn. 

# Reviews route
Route die wordt gebruikt voor het aanmaken, bijwerken, etc. van reviews. Een review bestaat uit een shirt, een rating en een commentaar. Als user kan je enkel een review onder je eigen naam aanmaken.

- GET /reviews Dit endpoint geeft alle beschikbare reviews weer.
- GET /reviews/:id Dit endpoint geeft de details van een specifieke review weer op basis van het opgegeven ID
- POST /reviews Dit endpoint wordt gebruikt om een nieuwe review aan te maken.  Body bestaat uit een shirt, rating en comment. Om deze endpoint te kunnen gebruiken, moet de gebruiker ingelogd zijn. De review wordt onder de naam van de ingelogde gebruiker geplaatst.  
- PUT /reviews/:id Dit endpoint wordt gebruikt om een bestaande review bij te werken op basis van het opgegeven ID. De request body bestaat uit een shirt, rating en comment. Om dit endpoint te gebruiken, moet de gebruiker ingelogd zijn. (Bedoeling was dat een user enkel zijn eigen reviews kan bijwerken, maar bij de test bleef ik maar errors krijgen..)
- DELETE /reviews/:id Dit endpoint wordt gebruikt om een bestaande review te verwijderen op basis van het opgegeven ID. Om dit endpoint te gebruiken, moet de gebruiker ingelogd zijn.

# Shirts route
Route die wordt gebruikt voor het aanmaken, bijwerken, etc. van shirts. Een shirt bestaat uit een naam, een beschrijving, etc. 

- GET /shirts Dit endpoint geeft alle shirts weer
- GET /shirts/:id Dit endpoint geeft de details van een specifieke shirt weer op basis van het opgegeven ID.
- POST /shirts Dit endpoint wordt gebruikt om een nieuwe shirt aan te maken. Body bestaat uit een naam, beschrijving, prijs, categorie, maten en kleuren. Om deze endpoint te kunnen gebruiken, moet de gebruiker ingelogd zijn.
- PUT /shirts/:id Dit endpoint wordt gebruikt om een bestaande shirt bij te werken op basis van het opgegeven ID. Om dit endpoint te gebruiken, moet de gebruiker ingelogd zijn.
- DELETE /shirts/:id Dit endpoint wordt gebruikt om een bestaande review te verwijderen op basis van het opgegeven ID. Om dit endpoint te gebruiken, moet de gebruiker ingelogde admin zijn.
