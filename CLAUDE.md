# CLAUDE.md – Kontekst dla Claude Code

## Projekt
Konfigurator wynajmu dla **Konfero** – centrum konferencyjnego w Ustroniu (Beskidy).
Repozytorium: `edwinooit/konfigurator-konfero`

## Architektura

Cały konfigurator to **jeden plik `konfigurator.js`** – samoładujący się skrypt, który:
1. Wstrzykuje CSS do `<head>`
2. Wstrzykuje HTML do `<div id="konfero-konfigurator">`
3. Uruchamia logikę JS (IIFE – bez zanieczyszczania globalnego scope'u)

Plik jest hostowany na GitHub i serwowany przez **jsDelivr CDN**.
W Webflow na stronie `/konfigurator` jest tylko:
```html
<div id="konfero-konfigurator"></div>
<script src="https://cdn.jsdelivr.net/gh/edwinooit/konfigurator-konfero@main/konfigurator.js"></script>
```

Po pushu na `main`, czyść cache: `https://purge.jsdelivr.net/gh/edwinooit/konfigurator-konfero@main/konfigurator.js`

## Marka Konfero – styl wizualny

- **Font**: Open Sans (już załadowany na konfero.pl)
- **Niebieski**: `#1c52a4` (główny kolor marki)
- **Pomarańczowy**: `#fb5607` (akcent, CTA, ceny promocyjne)
- **Pastelowy niebieski**: `#a8c1f7`
- **Cool blue tło**: `#e8eef7`
- **Border radius kart**: `10px`
- **Pill buttony**: `border-radius: 20rem`
- Wszystkie klasy CSS mają prefix `.kk` – żeby nie kolidować z Webflow

## Struktura konfiguratora

4-krokowy wizard:
1. **Typ eventu** – wybór pakietu + liczba dni
2. **Dodatki** – upgrade'y specyficzne dla pakietu (dynamicznie renderowane)
3. **Moduły** – catering (cena × liczba osób) + usługi (cena stała)
4. **Podsumowanie** – rozbicie kosztów + CTA do kontaktu

Floating bar na dole strony pokazuje bieżącą kwotę.

## Pakiety i ceny (v2.1)

| Pakiet | Cena bazowa | Zawiera (wartość rynkowa) |
|--------|------------|--------------------------|
| Konferencyjna | 7 000 zł/dzień | Sala Diament 4 500 + LED 2 500 + nagłośnienie 1 500 + oświetlenie 1 000 = 9 500 zł |
| Bankietowa | 8 000 zł/dzień | Sala 4 500 + stoły 1 500 + nagł.+ośw. 2 000 + Gold 1 500 = 9 500 zł |
| Eventowa | 7 000 zł/dzień | Jak Konferencyjna = 9 500 zł |
| Plenerowa | 6 000 zł/dzień | Teren 3 000 + prąd 1 000 + strefa 1 500 + hol 1 000 = 6 500 zł |

Zniżki wielodniowe: 2. dzień –20%, 3. i kolejne –25%.
Ceny netto + VAT 23%.

## Tłumaczenia symultaniczne – specjalna logika

- Do 50 osób: 1 500 zł/dzień (flat)
- Powyżej 50 osób: 1 500 zł bazowo × dni + 15 zł × liczba osób
- ID modułu: `m-trans50` i `m-trans50p`
- Kalkulacja w `calc()` ma osobny `if(mid==='m-trans50p')` branch

## Zasady przy edycji

1. **En dashe (–), nie em dashe (—)** – w polskim tekście używamy pauzy, nie myślnika
2. **„Liczba" nie „ilość"** – dla osób i rzeczy policzalnych (liczba uczestników, liczba dni)
3. **Nie promować cateringu jako samodzielnej usługi** – catering jest tylko modułem w ramach eventu (ludzie dzwonili zamawiać jedzenie, a to nie jest ich profil)
4. **Obiekt na wyłączność** – to kluczowy wyróżnik vs hotele
5. **Dekoracja sali** – elementy dostępne na obiekcie, BEZ zakupu dodatkowych materiałów
6. **Namiot** – opis „~100 osób", wymiary 6×12 m
7. **Pojemność max**: 550 osób (teatralnie), 350 biesiadnie, 300 bankietowo
8. **Ekran LED**: 4×8 m (stały, nie wynajmowany)
9. **Scena**: 12,5×4,5 m z zapleczem backstage

## Kontakt Konfero

- Adres: ul. Skoczowska 134, 43-450 Ustroń
- Email: kontakt@konfero.pl
- Strona: konfero.pl

## Planowane feature'y

- [ ] Formularz kontaktowy w kroku 4 – pola: imię, email/telefon, planowana data, liczba uczestników, komentarz
- [ ] Wysyłka kalkulacji na kontakt@konfero.pl (i kopii do klienta)
- [ ] Zbieranie leadów – email/telefon nawet bez wysyłki (monitoring zachowań w konfiguratorze, jak sugerował Andrzej)
- [ ] Tracking – jakie opcje ludzie klikają, które pakiety wybierają

## Kto jest kim

- **Edwin** (Rocksoft) – marketing, SEO, rozwój konfiguratora
- **Bronek Bujok** – zarząd Konfero, decyzje cenowe
- **Andrzej Polok** – technika AV, perspektywa organizatora eventów
- **Leszek Czyż** – zarząd, perspektywa biznesowa
