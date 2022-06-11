# PG6301 eksamen <tittel på løsningen>

## Egenutfylling av funksjonelle krav

-   [x] Anonyme brukere skal se nyhetsaker når de kommer til nettsiden. Legg inn noen nyhetssaker for å demonstrere
-   [x] Når en ny sak publiseres, skal alle brukerne få se den nye saken umiddelbart. Bruk websockets for å sende oppdateringer
-   [x] Brukere kan logge seg inn. Det anbefales at du implementerer at brukerne logger seg inn med Google, men andre mekanismer er også akseptabelt
-   [x] En bruker som er logget inn kan se på sin profilside (userinfo fra Google)
-   [x] Brukere skal forbli logget inn når de refresher websiden
-   [x] En bruker som er logget inn kan klikke på en nyhetssak for å se detaljene om nyhetssaken. Detaljene skal inkludere en nyhetskategori, overskrift, tekst og navn på den som publiserte den
-   [x] "Redaksjonelle brukere" kan logge seg inn med Active Directory. Det må fungere å logge seg inn med en Active Directory på skolens AD ( domain_hint=egms.no )
-   [x] Redaksjonelle brukere kan publisere nye nyhetsartikler
-   [x] Nyhetsartikkel skal inneholde en kategori valgt fra en nedtrekksliste ( <select> ), tittel ( <input> ) og tekst ( <textarea> )
-   [x] Dersom noen allerede har publisert en nyhetsartikkel med samme tittel skal serveren sende HTTP status kode 400 og en feilmelding
-   [x] Brukeren skal forhindres fra å sende inn en nyhetsartikkel som mangler kategori, tittel eller tekst
-   [x] En redaksjonell bruker skal kunne redigere en artikkel de selv har publisert
-   [x] Alle feil fra serves skal presenteres til bruker på en pen måte, med mulighet for brukeren til å prøve igjen

## Egenutfylling av tekniske krav

-   [x] Oppsett av package.json, parcel, express, prettier
-   [x] React Router
-   [x] Express app
-   [x] Kommunikasjon mellom frontend (React) og backend (Express)
-   [x] Deployment til Heroku
-   [x] Bruk av MongoDB
-   [x] OpenID Connect
-   [x] Web Sockets
-   [x] Jest med dokumentert testdekning
