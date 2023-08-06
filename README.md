# Doumentatie clothing-store-api
Ik heb een API voor shirts geschreven. Er zijn zes routes: auth, users, categories, orders, reviews en shirts.

# Deployment
Deployment: Ik heb mijn API deployed volgens het filmpje op Toledo. Mijn adres is http://34.77.228.196:3000/api
De privatekey wordt ingesteld aan de hand van "clothing_store_jwtPrivateKey". 

# Users route
- POST /users Dit endpoint wordt gebruikt om een nieuwe gebruiker aan te maken. De request body moet de volgende gegevens bevatten: name, email, password en isAdmin. De eerste drie zijn verplicht, isAdmin staat default op false. 
- GET /users/me Dit endpoint wordt gebruikt om de gegevens van de ingelogde gebruiker op te halen. Inloggen gebeurt via het auth endpoint. Zodra een gebruiker is ingelogd, kan deze endpoint worden gebruikt om informatie over de ingelogde gebruiker op te halen.
- DELETE /users/:id Dit endpoint wordt gebruikt om een gebruiker te verwijderen. Het verwijderen van een gebruiker kan alleen worden gedaan door een ingelogde admin. De gebruiker die moet worden verwijderd, wordt geïdentificeerd aan de hand van het meegegeven ID in de URL.

# Auth route
- POST /auth Dit endpoint wordt gebruikt om in te loggen. De request body moet de volgende gegevens bevatten: email en password. Wanneer een verzoek wordt gedaan met de juiste combinatie van e-mail en wachtwoord, genereert de API een JWT. 

# Categories route
- GET /categories Dit endpoint geeft alle beschikbare categorieën weer.
- GET /categories/:id Dit endpoint geeft de details van een specifieke categorie weer op basis van het opgegeven ID
- POST /categories Dit endpoint wordt gebruikt om een nieuwe catgeorie aan te maken. Body bestaat uit een naam en een beschrijving. Om dit endpoint te gebruiken, moet de gebruiker ingelogd zijn. 
- PUT /categories/:id Dit endpoint wordt gebruikt om een bestaande categorie bij te werken op basis van het opgegeven ID. De request body bestaat uit een naam en beschrijving. Om dit endpoint te gebruiken, moet de gebruiker in gelogd zijn.
- DELETE /categories/:id Dit endpoint wordt gebruikt om een bestaande categore te verwijderen op basis van het opgegeven ID. Om dit endpoint te gebruiken, moet de gebruiker ingelogd zijn.

# Orders route
- GET /orders Dit endpoint geeft alle aangemaakte orders weer van de ingelogde user weer. 
- GET /orders/:id Dit endpoint geeft een order op basis van het opgegeven ID weer van een ingelogde user weer. Om dit endpoint te gebruiken, moet de gebruiker ingelogd zijn.
- POST /orders Dit endpoint wordt gebruikt om een nieuwe order aan te maken. Body bestaat uit een user, shirts en totalprice. Om dit endpoint te gebruiken, moet de gebruiker ingelogd zijn. 
- PUT /orders Dit endpoint wordt gebruikt om een bestaande order bij te werken op basis van het opgegeven ID. Een user kan enkel zijn eigen orders bijwerken! User moet ingelogd zijn.
- DELETE Dit endpoint wordt gebruikt om een bestaande order op basis van het opgegeven ID te verwijderen. De gebruiker kan enkel zijn eigen orders verwijderen! Gebruiker moet ingelogd zijn. 

# Reviews route
- GET /reviews Dit endpoint geeft alle beschikbare reviews weer.
- GET /reviews/:id Dit endpoint geeft de details van een specifieke categorie weer op basis van het opgegeven ID
- POST /reviews Dit endpoint wordt gebruikt om een nieuwe review aan te maken.  Body bestaat uit een shirt, rating en comment. Om deze endpoint te kunnen gebruiken, moet de gebruiker ingelogd zijn. De review wordt onder de naam van de ingelogde gebruiker geplaatst.  
- PUT /reviews/:id Dit endpoint wordt gebruikt om een bestaande review bij te werken op basis van het opgegeven ID. De request body bestaat uit een shirt, rating en comment. Om dit endpoint te gebruiken, moet de gebruiker ingelogd zijn. 
- DELETE /reviews/:id Dit endpoint wordt gebruikt om een bestaande review te verwijderen op basis van het opgegeven ID. Om dit endpoint te gebruiken, moet de gebruiker ingelogd zijn.

# Shirts route
- GET /shirts Dit endpoint geeft alle shirts weer
- Get /shirts/:d Dit endpoint geeft de details van een specifieke shirt weer op bass van het opgegeven ID.
- POST /shirts Dit endpoint wordt gebruikt om een nieuwe shirt aan te maken. Body bestaat uit een naam, beschrijving, prijs, catgegorie, maten en kleuren. Om deze endpoint te kunnen gebruiken, moet de gebruiker ingelogd zijn.
- PUT /shirts/:id Dit endpoint wordt gebruikt om een bestaande shirt bij te werken op basis van het opgegeven ID. Om dit endpoint te gebruiken, moet de gebruiker ingelogd zijn.
- DELETE/:id Dit endpoint wordt gebruikt om een bestaande review te verwijderen op basis van het opgegeven ID. Om dit endpoint te gebruiken, moet de gebruiker ingelogd zijn.
