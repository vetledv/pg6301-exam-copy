# PG6301 eksamen <tittel på løsningen>

[Github](https://github.com/kristiania-pg6301-2022/pgr6301-exam-vetledv)
[Heroku](https://pg6301-vetledv-exam.herokuapp.com/)
[Coveralls](https://coveralls.io/github/kristiania-pg6301-2022/pgr6301-exam-vetledv)

COVERALLS DØDE
LINK TIL SCREENSHOT AV TESTER:
[Tester](https://i.imgur.com/QiNrLsN.png)

## Egenutfylling av funksjonelle krav

* [X] Anonyme brukere skal se nyhetsaker når de kommer til nettsiden. Legg inn noen nyhetssaker for å demonstrere
* [X] Når en ny sak publiseres, skal alle brukerne få se den nye saken umiddelbart. Bruk websockets for å sende oppdateringer
* [X] Brukere kan logge seg inn. Det anbefales at du implementerer at brukerne logger seg inn med Google, men andre mekanismer er også akseptabelt
* [X] En bruker som er logget inn kan se på sin profilside (userinfo fra Google)
* [X] Brukere skal forbli logget inn når de refresher websiden
* [X] En bruker som er logget inn kan klikke på en nyhetssak for å se detaljene om nyhetssaken. Detaljene skal inkludere en nyhetskategori, overskrift, tekst og navn på den som publiserte den
* [X] "Redaksjonelle brukere" kan logge seg inn med Active Directory. Det må fungere å logge seg inn med en Active Directory på skolens AD ( domain_hint=egms.no )
* [X] Redaksjonelle brukere kan publisere nye nyhetsartikler
* [X] Nyhetsartikkel skal inneholde en kategori valgt fra en nedtrekksliste ( <select> ), tittel ( <input> ) og tekst ( <textarea> )
* [X] Dersom noen allerede har publisert en nyhetsartikkel med samme tittel skal serveren sende HTTP status kode 400 og en feilmelding
* [X] Brukeren skal forhindres fra å sende inn en nyhetsartikkel som mangler kategori, tittel eller tekst
 * skjer ikke på update artikkel og er case sensitive, glemte av dette.
* [X] En redaksjonell bruker skal kunne redigere en artikkel de selv har publisert
* [X] Alle feil fra serves skal presenteres til bruker på en pen måte, med mulighet for brukeren til å prøve igjen

## Egenutfylling av tekniske krav

* [X] Oppsett av package.json, parcel, express, prettier
* [X] React Router
* [X] Express app
* [X] Kommunikasjon mellom frontend (React) og backend (Express)
* [X] Deployment til Heroku
* [X] Bruk av MongoDB
* [X] OpenID Connect
* [X] Web Sockets
* [X] Jest med dokumentert testdekning
  * Minutter for github actions ble borte etter at jeg startet å skrive mesteparten av testene mine. Linket til screenshots av client og server tester øverst i readme.

## .env
```
MONGO_URL="mongodb+srv://vetledv:5yoWJzFXNGayjEIe@cluster0.iofcb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
MONGODB_NAME="pg6301-exam"
COOKIE_SECRET="idsorfugbae234sd29fwrfs9dfnar"
GOOGLE_CLIENT_ID="813139596167-5df6aoesn2osbl6l7qart1h9vknqibj1.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
AZURE_CLIENT_ID="507d9e0c-28bf-4653-8275-18cab56fc869"
```