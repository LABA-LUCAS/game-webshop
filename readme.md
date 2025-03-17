



<!-- ik kan dit onder andere gebruiken voor mijn sollicitaties, dus maak het efficient, werkend, interactief, leuk, serieus -->



<!-- 
Functionele eisen: 
Het project is een webshop / bestelapplicatie.
Het project moet online te bereiken zijn, zie bijvoorbeeld netlify voor gratis hosting.
De webshop start met minimaal 5 producten, opgehaald van een API of een JSON-bestand.
De webshop moet bewerkt kunnen worden door een admin.
Form-invoer moet worden gevalideerd
Producten, de winkelwagen en orders worden opgeslagen in localstorage



Eindgebruiker
De webshop opent standaard in de eindgebruikersomgeving. Een gebruiker kan:

Een overzicht van alle producten zien
Producten toevoegen aan de winkelwagen
Zien of er producten in de winkelwagen zitten.
De winkelwagen legen
Bestellen. Je hoeft geen betalingen / persoonsgegevens te verwerken. Je moet wel een bestelbevestiging te zien krijgen. De bestelling moet worden opgeslagen.



Admin
Er is een admin-gedeelte in de webshop. De admin kan:

Een overzicht zien van alle bestellingen
Producten toevoegen / wijzigen / verwijderen
Producten 'resetten' naar de originele staat door weer het databestand of de API uit te lezen.
Niet-functionele eisen
De code is modulair opgebouwd
De webshop is getest op fouten.
De code is gedocumenteerd
De code is 'clean' en leesbaar geschreven.
De code is efficiënt.
De webshop en het admin-gedeelte hebben een gebruiksvriendelijke interface.
Vóór de implementatie is er een plan van aanpak en een ontwerp gemaakt.
Er is een README.md geschreven met uitleg over het project en instructies om het project lokaal uit te voeren.



Begrip van Technieken
In je project moet duidelijk zijn dat je minstens de volgende technieken kan toepassen:

Objects
Functies
Arrays
local storage
Variabelen: correct gebruik van let en const
 -->





<!-- MIJN STAPPENPLAN OM DIT EINDPROJECT TE VORMEN 
wat wil ik bereiken?
Algemene beschrijving:
ik wil een interactieve webshop maken voor het bestellen van games (inspiratie zou zijn gamemania), een verzameling van nepgames maken en tentoonstellen voor leerdoeleinden


GEBRUIKER ERVARING:
ik wil dat de homepagina wordt geladen met een aantal producten met afbeeldingen
ik wil dat de homepagina een gedeelte heeft meteen onder de eerste rij met een aantal "sales" 
ik wil dat onder elk product een knop komt die zegt "Voeg toe aan winkelwagen"
ik wil dat er op elke afbeedling geklikt kan worden om informatie te vinden over het product, 
en wanneer dat gebeurt wil ik dat de pagina laadt zodat er een eigen pagina is van elk product
ik wil dat als er een product wordt toegevoegd aan de winkelwagen of als er al producten in staan, er een rode bal bij het icoon komt.
ik wil dat als er meer dan 1 product in zit het een getal aangeeft zoals +3 tot max +9 indien het meer dan 9 is
ik wil dat als er op de winkelwagen knop in menu of het icoon wordt geklikt je wordt gebracht naar de pagina van de winkelwagen met je producten
ik wil dat er een aantal dingen qua informatie wordt weergegeven over elk product
ik wil dat als je op 1 van de producten in je winkelwagen klikt je hun informatiepagina krijgt
ik wil dat de gebruiker producten uit de winkelwagen kan halen door op de vuilnisbak icon te klikken
ik wil dat de gebruiker 1 of meerdere producten kan selecteren om te verwijderen
ik wil dat er een melding komt om te vragen of de gebruiker zeker is en als die ja klikt het verwijderd wordt uit de winkelwagen en bij nee stopt het selecteren voor producten te verwijderen
ik wil dat in de winkelwagen berekent wordt hoeveel alle kosten bij elkaar zijn en wordt aangegeven bij met totaal en het bedrag
ik wil een knop die zegt "Afrekenen" 
ik wil dat als je klikt op afrekenen je een bestelbevestiging krijgt

ADMINERVARING:
ik wil een adminpagina 
ik wil kunnen zien welke producten er besteld zijn en een gedeelte die aangeeft welke producten er zijn
ik wil producten kunnen aanpassen en/of verwijderen door op "edit" of "delete" te klikken 
ik wil dat als je op edit klikt het je naar een pagina brengt waar je het product kan aanpassen en dat er een knop is om terug te gaan
ik wil dat er een knop is die de veranderingen opslaat en het meteen zichtbaar is voor zowel de admin als gebruiker (dit kan zijn naam, prijs etc)
ik wil dat als je op de terug gaan knop klikt het je vraagt of je zeker bent, en het dan de aanpassingen die je hebt gedaan niet opslaat
ik wil dat als je op delete klikt het product van de pagina verwijdert wordt/niet wordt opgehaald uit de json of api
ik wil een knop die de verwijderde producten reset op de product pagina waar je alles kan aanpassen
ik wil dat de wijzigingen die worden opgeslagen worden veranderd op de homepagina bij elk product indien er een aanpassing heeft plaatsgevonden
 -->


<!-- {jouw-domein}/admin -->