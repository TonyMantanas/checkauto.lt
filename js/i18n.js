/* ==========================================================================
   i18n.js - Internationalization system for checkauto.lt
   
   Translations are embedded inline to avoid fetch() issues with file://
   protocol and to work without a server. Language switcher persists
   the choice to localStorage.
   
   No dependencies. No build step. Pure vanilla JS.
   ========================================================================== */

(function () {
  'use strict';

  const DEFAULT_LANG = 'lt';

  /** All translations embedded inline */
  const translations = {
    "lt": {
      "nav": { "home": "Pradžia", "services": "Paslaugos", "process": "Procesas", "about": "Apie", "contact": "Kontaktai", "faq": "D.U.K." },
      "home": {
        "hero": { "label": "Nepriklausoma automobilių patikra", "title": "Pigiau sužinoti dabar nei mokėti paskui", "subtitle": "Prieš perkant naudotą automobilį – vizualinė apžiūra, kompiuterinė diagnostika ir dokumentuota ataskaita.", "cta": "Užsakyti patikrą", "scroll": "žemyn" },
        "problem": { "label": "Rizika", "title": "Pirkti be patikros – brangus eksperimentas", "text": "Dauguma naudotų automobilių Lietuvoje slepia defektus. Pardavėjui naudinga nutylėti – problemas atskleidžia tik nepriklausoma patikra.", "stat1_number": "63%", "stat1_label": "naudotų automobilių turi paslėptų defektų", "stat2_number": "€1,200+", "stat2_label": "vidutinė neplanuoto remonto kaina", "stat3_number": "1 iš 4", "stat3_label": "automobilių parduodami su sukta rida" },
        "why": { "label": "Paslėptos rizikos", "title": "Ko nepamatysite patys", "item1_title": "Techniniai defektai", "item1_text": "Variklio, greičių dėžės ar pakabos problemos akimi nematomos. Jas aptinka tik profesionali diagnostika.", "item2_title": "Suklastota istorija", "item2_text": "Sukta rida, nuslėptos avarijos, perdažytas kėbulas – visa tai išaiškėja tik atlikus patikrą.", "item3_title": "Stipresnė derybinė pozicija", "item3_text": "Žinodami tikrą automobilio būklę, galite derėtis argumentuotai – arba tiesiog atsisakyti blogo sandorio.", "item4_title": "Apsauga nuo nuostolių", "item4_text": "Patikra kainuoja kelis kartus mažiau nei netikėtas remontas, kurio galima išvengti." },
        "compare": { "label": "Palyginimas", "title": "Koks skirtumas, kai tikrina specialistas", "title_prefix": "Koks skirtumas, kai tikrina", "title_accent": "specialistas", "subtitle": "Pardavėjas visada žinos daugiau nei jūs – nebent pasitelksite nepriklausomą specialistą.", "without": "Be patikros", "with": "Su checkauto.lt", "no1": "Sprendžiate pagal pardavėjo žodžius ir skelbimo nuotraukas", "no2": "Sukta rida ar ištrinti klaidų kodai – be įrangos to nepastebėsite", "no3": "Po avarijos perdažyti elementai lieka neatpažinti", "no4": "\u201eViskas tvarkinga\u201c – o po mėnesio serviso sąskaita viršija €1\u00a0500", "no5": "Derėtis tenka iš nuojautos, ne iš faktų", "no6": "Spaudžia nuspręsti vietoje – \u201erytoj jau parduotas\u201c", "yes1": "Automobilį už jus tikrina nepriklausomas specialistas", "yes2": "OBD diagnostika, ridos patikra, paslėptų klaidų paieška", "yes3": "Dažo storio matavimas, kėbulo geometrijos tikrinimas", "yes4": "Gaunate aiškią ataskaitą su nuotraukomis – žinote, už ką mokate", "yes5": "Kiekvienas rastas defektas – argumentas derybose", "yes6": "Ramybė, kad nusipirkote tai, ką tikrai matėte" },
        "cta": { "title": "Geras sprendimas prasideda nuo faktų", "text": "Patikra užtrunka porą valandų. Netikėtas remontas – mėnesius.", "button": "Susisiekti" }
      },
      "services": {
        "hero": { "label": "Paslaugos", "title": "Ką galime padaryti už jus", "subtitle": "Kiekviena paslauga padeda priimti sprendimą remiantis faktais, ne prielaidomis." },
        "s1": { "number": "01", "title": "Išsami patikra prieš pirkimą", "text": "Atvykstame ir tikriname automobilį vietoje – kėbulą, variklį, greičių dėžę, pakabą, elektros sistemą, saloną. Viską, ką pardavėjas gali nutylėti. Rezultatas – ataskaita su nuotraukomis ir aiškia rekomendacija.", "link": "Užsakyti patikrą" },
        "s2": { "number": "02", "title": "Kompiuterinė diagnostika", "text": "Profesionaliu OBD skaitytuvu nuskaitome klaidų kodus, tikriname sistemų būklę ir analizuojame duomenis. Diagnostika apima variklio valdymo bloką, saugos, komforto ir transmisijos sistemas.", "link": "Užsakyti diagnostiką" },
        "s3": { "number": "03", "title": "Konsultacija prieš apžiūrą", "text": "Prieš važiuojant žiūrėti automobilio – galime įvertinti skelbimą. Peržvelgiame nuotraukas, kainą, specifikacijas ir pasakome, ar verta skirti laiką apžiūrai.", "link": "Gauti konsultaciją" },
        "s4": { "number": "04", "title": "Pagalba perkant ar parduodant", "text": "Padedame surasti patikimą automobilį arba tinkamai parduoti turimą. Procesas skaidrus – be tarpininkų schemų ir paslėptų interesų.", "link": "Sužinoti daugiau" },
        "cta": { "title": "Reikia individualaus sprendimo?", "text": "Parašykite – pritaikysime paslaugą jūsų situacijai.", "button": "Susisiekti" },
        "checklist": { "label": "Patikros apimtis", "title": "Ką tikriname kiekvieno vizito metu", "item1": "Kėbulo būklė, dažo storis, korozijos požymiai", "item2": "Variklis, greičių dėžė, aušinimo sistema", "item3": "Pakaba, stabdžiai, vairo mechanizmas", "item4": "Elektros sistema ir kompiuterinė diagnostika (OBD)", "item5": "Salono būklė ir elektronikos veikimas", "item6": "Skysčių lygis ir jų būklė", "item7": "Padangų būklė ir nusidėvėjimo tolygumas", "item8": "Ridos analizė ir istorijos patikra", "item9": "Bandomasis važiavimas", "item10": "Dokumentuota ataskaita su nuotraukomis ir rekomendacija", "process_link": "Kaip vyksta patikros procesas \u2192" },
        "faq": { "label": "D.U.K.", "title": "Klausimai, kuriuos užduoda visi", "q1": "Ar tikrai verta mokėti už patikrą?", "a1": "Galite ir nemokėti. Tada mokėsite serviso sąskaitą, kuri bus kelis kartus didesnė. Patikra – tai ne išlaidos, o draudimas nuo brangių staigmenų.", "q2": "Kiek laiko užtrunka patikra?", "a2": "Vidutiniškai 1,5–2 valandos. Priklauso nuo automobilio ir jo būklės. Neskubame – geriau rasti problemą dabar nei gailėtis paskui.", "q3": "Ar atvykstate į bet kurį miestą?", "a3": "Taip. Atvykstame ten, kur stovi automobilis – pas pardavėją, į aikštelę, į servisą. Jums nereikia nieko organizuoti.", "q4": "Ką gaunu po patikros?", "a4": "Dokumentuotą ataskaitą su nuotraukomis, rastais defektais ir aiškia rekomendacija – pirkti, derėtis ar bėgti.", "more": "Visi klausimai ir atsakymai" }
      },
      "faq": {
        "hero": { "label": "D.U.K.", "title": "Klausimai, kuriuos užduoda visi", "subtitle": "Be marketingo. Tik esmė." },
        "q1": "Ar tikrai verta mokėti už patikrą?", "a1": "Galite ir nemokėti. Tada mokėsite serviso sąskaitą, kuri bus kelis kartus didesnė. Patikra – tai ne išlaidos, o draudimas nuo brangių staigmenų.",
        "q2": "Kiek laiko užtrunka patikra?", "a2": "Vidutiniškai 1,5–2 valandos. Priklauso nuo automobilio ir jo būklės. Neskubame – geriau rasti problemą dabar nei gailėtis paskui.",
        "q3": "Ar atvykstate į bet kurį miestą?", "a3": "Taip. Atvykstame ten, kur stovi automobilis – pas pardavėją, į aikštelę, į servisą. Jums nereikia nieko organizuoti.",
        "q4": "Ką gaunu po patikros?", "a4": "Dokumentuotą ataskaitą su nuotraukomis, rastais defektais ir aiškia rekomendacija – pirkti, derėtis ar bėgti.",
        "q5": "O jei automobilis pasirodys geras?", "a5": "Puiku – tada žinosite, kad mokate už tai, ką tikrai gaunate. Ramybė irgi turi savo kainą.",
        "q6": "Ar galiu dalyvauti patikroje?", "a6": "Žinoma. Netgi skatiname. Pamatysite procesą savo akimis ir galėsite užduoti klausimus vietoje.",
        "q7": "Ar tikrinate tik naudotus automobilius?", "a7": "Daugiausia – taip. Bet jei perkate demonstracinį ar \u201ebeveik naują\u201c – tikrinti verta. Salonas irgi gali nutylėti.",
        "q8": "Kiek kainuoja patikra?", "a8": "Kaina priklauso nuo paslaugos apimties ir vietos. Susisiekite – pasakysime tiksliai per kelias minutes.",
        "q9": "Ar padedate derėtis dėl kainos?", "a9": "Tiesiogiai – ne. Bet ataskaita su konkrečiais defektais yra stipriausias derybinis argumentas, kokį galite turėti.",
        "q10": "Kaip užsakyti patikrą?", "a10": "Paskambinkite, parašykite arba užpildykite formą kontaktų puslapyje. Atsakome per kelias valandas.",
        "cta": { "title": "Neradote atsakymo?", "text": "Parašykite – atsakysime asmeniškai.", "button": "Susisiekti" }
      },
      "process": {
        "hero": { "label": "Procesas", "title": "Aiški eiga nuo pradžios iki galo", "subtitle": "Nuo pirmo skambučio iki ataskaitos – kiekvienas žingsnis aiškus ir suprantamas." },
        "step1": { "number": "Etapas 01", "title": "Užklausa", "text": "Paskambinate, parašote el. paštu arba užpildote formą. Nurodote, kokį automobilį ir kur reikia patikrinti." },
        "step2": { "number": "Etapas 02", "title": "Laiko suderinimas", "text": "Suderiname patikros laiką pagal jūsų galimybes – dirbame ir vakarais, ir savaitgaliais." },
        "step3": { "number": "Etapas 03", "title": "Atvykimas", "text": "Atvykstame ten, kur yra automobilis – pas pardavėją, į aikštelę ar servisą." },
        "step4": { "number": "Etapas 04", "title": "Patikra ir diagnostika", "text": "Atliekame vizualinę apžiūrą, kompiuterinę diagnostiką ir bandomąjį važiavimą. Kiekvieną elementą tikriname pagal nustatytą metodiką." },
        "step5": { "number": "Etapas 05", "title": "Ataskaita", "text": "Pateikiame aiškią ataskaitą su nuotraukomis, rastais defektais ir rekomendacija. Be dviprasmybių." },
        "step6": { "number": "Etapas 06", "title": "Jūsų sprendimas", "text": "Visa informacija – jūsų rankose. Pirkti, derėtis ar atsisakyti – sprendžiate turėdami faktus." },
        "cta": { "title": "Viskas prasideda nuo užklausos", "text": "Užtenka vieno skambučio ar žinutės.", "button": "Susisiekti" }
      },
      "about": {
        "hero": { "label": "Apie mus", "title": "Nepriklausomi. Objektyvūs. Jūsų pusėje.", "title1": "Nepriklausomi.", "title2": "Objektyvūs.", "title3": "Jūsų pusėje.", "subtitle": "Patikros paslauga su vienu tikslu – objektyviai įvertinti automobilio būklę." },
        "intro": { "p1": "Esame nepriklausoma automobilių patikros paslauga. Nedirbame su salonais, pardavėjais ar platformomis. Vienintelis mūsų interesas – kad jūs nepermokėtumėte už svetimas problemas.", "p2": "Kiekvienoje patikroje randame tai, ką pardavėjas nutyli – suktą ridą, paslėptų avarijų pėdsakus, išvalytus klaidų kodus. Tikslas – padėti nuspręsti remiantis faktais, ne pardavėjo žodžiais.", "p3": "Dirbame be skubėjimo, pagal aiškią metodiką. Kiekvieną automobilį vertiname taip, lyg pirktume patys." },
        "values": { "label": "Principai", "heading": "Kuo remiamės kiekvienoje patikroje", "v1_title": "Nepriklausomumas", "v1_text": "Jokių ryšių su salonais ar pardavėjais. Vertinimas visada objektyvus ir nešališkas.", "v2_title": "Skaidrumas", "v2_text": "Ataskaita suprantama be specialių žinių. Jokių paslėptų eilučių ar dviprasmybių.", "v3_title": "Kruopštumas", "v3_text": "Kiekviena patikra atliekama iki galo, pagal tą pačią metodiką. Netrumpiname dėl laiko." },
        "quote": "Kiekvieną automobilį vertiname taip, lyg pirktume patys.",
        "philosophy": { "quote": "Kiekvieną automobilį vertiname taip, lyg pirktume patys.", "author": "— checkauto.lt komanda", "context": "Tai ne šūkis, o darbo principas. Kiekviena patikra atliekama be kompromisų – kad jūsų sprendimas remtųsi faktais." },
        "cta": { "title": "Patikra, kuria galite pasikliauti", "text": "Susisiekite – ir jums nereikės spėlioti dėl automobilio būklės.", "button": "Susisiekti" }
      },
      "contact": {
        "hero": { "label": "Kontaktai", "title": "Susisiekite su mumis", "subtitle": "Rašykite, skambinkite arba užpildykite formą. Atsakome per kelias valandas." },
        "info": { "title": "Tiesioginis ryšys", "text": "Greičiausias būdas – paskambinti arba parašyti žinutę. Atsakome greitai ir konkrečiai.", "phone_label": "Telefonas", "phone": "+370 600 00000", "email_label": "El. paštas", "email": "info@checkauto.lt" },
        "form": { "name_label": "Vardas", "name_placeholder": "Jūsų vardas", "phone_label": "Telefonas", "phone_placeholder": "+370...", "message_label": "Žinutė", "message_placeholder": "Automobilio markė, modelis, vieta", "submit": "Siųsti užklausą", "success": "Užklausa gauta. Susisieksime kuo greičiau." }
      },
      "footer": { "copy": "© 2026 checkauto.lt. Visos teisės saugomos.", "credit": "Svetainę sukūrė" }
    },
    "en": {
      "nav": { "home": "Home", "services": "Services", "process": "Process", "about": "About", "contact": "Contact", "faq": "FAQ" },
      "home": {
        "hero": { "label": "Professional car inspection", "title": "An inspection costs less than ignorance", "subtitle": "Comprehensive vehicle condition assessment before purchase. Visual evaluation, computer diagnostics, documented report.", "cta": "Order inspection", "scroll": "scroll" },
        "problem": { "label": "Risk", "title": "Buying a used car without inspection is a financial risk", "text": "Most used cars in Lithuania are sold with hidden defects. The seller has no interest in revealing problems. Only an independent inspection uncovers them.", "stat1_number": "63%", "stat1_label": "of used cars have hidden defects", "stat2_number": "€1,200+", "stat2_label": "average cost of unplanned repairs", "stat3_number": "1 in 4", "stat3_label": "cars are sold with tampered mileage" },
        "why": { "label": "Risk factors", "title": "What you won't see yourself", "item1_title": "Technical defects", "item1_text": "Engine, transmission, suspension issues invisible to the naked eye. Professional diagnostics identifies them.", "item2_title": "Falsified vehicle history", "item2_text": "Tampered mileage, hidden accidents, repainted body panels. An inspection reveals what the seller won't tell.", "item3_title": "Negotiation position", "item3_text": "An accurate vehicle condition report enables informed negotiation, or a timely walkaway.", "item4_title": "Financial protection", "item4_text": "An inspection is an investment that protects against thousands in unexpected repair costs." },
        "compare": { "label": "Before & after", "title": "What a buyer loses by not checking", "title_prefix": "What changes when a", "title_accent": "specialist checks", "subtitle": "The seller will always know more than you. Unless you bring a specialist.", "without": "Without inspection", "with": "With checkauto.lt", "no1": "Judging the car by the seller\u2019s words and listing photos", "no2": "Tampered mileage, cleared error codes, invisible without tools", "no3": "Repainted panels after an accident go undetected", "no4": "\u201cEverything\u2019s fine\u201d, then a \u20ac1,500+ service bill a month later", "no5": "Negotiating on gut feeling, not on facts", "no6": "Pressured to decide on the spot because \u201cit\u2019ll be sold next week\u201d", "yes1": "An independent specialist checks the car for you", "yes2": "OBD diagnostics, mileage analysis, hidden error scan", "yes3": "Paint thickness measurement and body geometry check", "yes4": "A clear report with photos. You\u2019ll know before you pay", "yes5": "A justified negotiation position with every defect found", "yes6": "Peace of mind that you bought what you actually saw" },
        "cta": { "title": "Decisions should be based on facts", "text": "An inspection takes a few hours. Unplanned repairs take months.", "button": "Get in touch" }
      },
      "services": {
        "hero": { "label": "Services", "title": "Service overview", "subtitle": "Every service is designed so that decisions are made based on facts, not assumptions." },
        "s1": { "number": "01", "title": "Comprehensive pre-purchase inspection", "text": "Full on-site vehicle evaluation: body, engine, transmission, suspension, electrical system, interior. Every element the seller might hope goes unnoticed is checked. The result: a documented report with photos and a clear recommendation.", "link": "Order inspection" },
        "s2": { "number": "02", "title": "Computer diagnostics", "text": "Using OBD scanners and professional software, error codes are read, system conditions are checked, and data is analyzed. Diagnostics covers not only the engine control unit but also safety, comfort, and transmission systems.", "link": "Order diagnostics" },
        "s3": { "number": "03", "title": "Pre-deal consultation", "text": "An opportunity to evaluate a specific listing before visiting the car. Photos, price, and specifications are analyzed. An opinion is provided on whether the car is worth the trip.", "link": "Get consultation" },
        "s4": { "number": "04", "title": "Car buying and selling", "text": "Assistance in finding a reliable vehicle or selling a current one. The process is conducted transparently, without intermediary schemes or hidden interests.", "link": "Learn more" },
        "cta": { "title": "Need a tailored solution?", "text": "Get in touch. The service will be adapted to the specific situation.", "button": "Contact" },
        "checklist": { "label": "Inspection scope", "title": "What is checked during every inspection", "item1": "Body condition, paint thickness, corrosion signs", "item2": "Engine, transmission, cooling system", "item3": "Suspension, brakes, steering mechanism", "item4": "Electrical system and computer diagnostics (OBD)", "item5": "Interior condition, electronics functionality", "item6": "Fluid levels and condition", "item7": "Tire condition and wear evenness", "item8": "Mileage analysis and history verification", "item9": "Test drive", "item10": "Documented report with photos and recommendation", "process_link": "See how the inspection works \u2192" },
        "faq": { "label": "FAQ", "title": "Questions everyone asks", "q1": "Is the inspection really worth paying for?", "a1": "You can skip it. Then you'll pay the mechanic instead — usually several times more. An inspection isn't an expense. It's insurance against expensive surprises.", "q2": "How long does an inspection take?", "a2": "About 1.5–2 hours on average. It depends on the car and its condition. We don't rush — better to find a problem now than regret it later.", "q3": "Do you come to any city?", "a3": "Yes. We come to wherever the car is — at the seller's place, a car lot, or a service center. You don't need to arrange anything.", "q4": "What do I get after the inspection?", "a4": "A documented report with photos, identified defects, and a clear recommendation — buy, negotiate, or walk away.", "more": "All questions and answers" }
      },
      "faq": {
        "hero": { "label": "FAQ", "title": "Questions everyone asks", "subtitle": "No marketing. Just the essentials." },
        "q1": "Is the inspection really worth paying for?", "a1": "You can skip it. Then you'll pay the mechanic instead — usually several times more. An inspection isn't an expense. It's insurance against expensive surprises.",
        "q2": "How long does an inspection take?", "a2": "About 1.5–2 hours on average. It depends on the car and its condition. We don't rush — better to find a problem now than regret it later.",
        "q3": "Do you come to any city?", "a3": "Yes. We come to wherever the car is — at the seller's place, a car lot, or a service center. You don't need to arrange anything.",
        "q4": "What do I get after the inspection?", "a4": "A documented report with photos, identified defects, and a clear recommendation — buy, negotiate, or walk away.",
        "q5": "What if the car turns out to be fine?", "a5": "Great — then you know you're paying for what you're actually getting. Peace of mind has its value too.",
        "q6": "Can I be present during the inspection?", "a6": "Absolutely. We even encourage it. You'll see the process firsthand and can ask questions on the spot.",
        "q7": "Do you only inspect used cars?", "a7": "Mostly, yes. But if you're buying a demo car or something \u201calmost new\u201d — it's still worth checking. Dealerships can be quiet about things too.",
        "q8": "How much does an inspection cost?", "a8": "It depends on the scope and location. Get in touch — we'll give you an exact figure within minutes.",
        "q9": "Do you help negotiate the price?", "a9": "Not directly. But a report with specific defects is the strongest negotiation tool you can have.",
        "q10": "How do I book an inspection?", "a10": "Call, write, or fill out the form on the contact page. We respond within a few hours.",
        "cta": { "title": "Didn't find your answer?", "text": "Drop us a message — we'll reply personally.", "button": "Contact" }
      },
      "process": {
        "hero": { "label": "Process", "title": "Clear structure, transparent result", "subtitle": "From inquiry to report. Every stage is defined and understandable." },
        "step1": { "number": "Stage 01", "title": "Inquiry", "text": "Contact is made by phone, email, or through the contact form. The vehicle and its location are specified." },
        "step2": { "number": "Stage 02", "title": "Scheduling", "text": "Inspection time is arranged according to the client's availability. Inspections are conducted evenings and weekends as well." },
        "step3": { "number": "Stage 03", "title": "On-site arrival", "text": "The inspection is performed at the vehicle's location: at the seller's, in a car lot, or at a service center." },
        "step4": { "number": "Stage 04", "title": "Inspection and diagnostics", "text": "Systematic visual inspection, computer diagnostics, and test drive. Every element is checked according to an established methodology." },
        "step5": { "number": "Stage 05", "title": "Documented report", "text": "A clear report is delivered with photos, identified defects, and an overall recommendation. No ambiguity." },
        "step6": { "number": "Stage 06", "title": "Client's decision", "text": "All necessary information is provided. The decision to buy, negotiate, or walk away is made based on facts." },
        "cta": { "title": "The process starts with an inquiry", "text": "One message or call is all it takes.", "button": "Contact" }
      },
      "about": {
        "hero": { "label": "About checkauto.lt", "title": "Independent. Objective. On the client's side.", "title1": "Independent.", "title2": "Objective.", "title3": "On the client's side.", "subtitle": "An inspection service with a single purpose: an objective assessment of the vehicle's condition." },
        "intro": { "p1": "We are an independent car inspection service. No partnerships with dealerships, sellers, or platforms. Our only interest is making sure you don't pay for someone else's problems.", "p2": "In every inspection, we uncover what the seller keeps quiet about — tampered mileage, hidden accident traces, cleared error codes. The goal: helping you decide based on facts, not the seller's words.", "p3": "We work without rush, following a clear methodology. Every car is evaluated as if we were buying it ourselves." },
        "values": { "label": "Principles", "heading": "The foundation of every inspection", "v1_title": "Independence", "v1_text": "No partnerships with dealerships or sellers. The assessment is objective and unbiased.", "v2_title": "Transparency", "v2_text": "The report is clear and understandable. No hidden lines or ambiguous wording.", "v3_title": "Thoroughness", "v3_text": "Every inspection follows an established methodology. No compromises on time." },
        "quote": "Every car is evaluated as if we were buying it ourselves.",
        "philosophy": { "quote": "Every car is evaluated as if we were buying it ourselves.", "author": "— the checkauto.lt team", "context": "This isn't a slogan — it's a working principle. Every inspection is performed without compromise, so your decision is based on facts." },
        "cta": { "title": "An inspection you can trust", "text": "Get in touch, and there will be no need to guess about the vehicle's condition.", "button": "Contact" }
      },
      "contact": {
        "hero": { "label": "Contact", "title": "Get in touch", "subtitle": "Inquiries are accepted by phone, email, and through the contact form. A response is provided within a few hours." },
        "info": { "title": "Direct contact", "text": "The fastest way is a phone call or message. Responses are quick and specific.", "phone_label": "Phone", "phone": "+370 600 00000", "email_label": "Email", "email": "info@checkauto.lt" },
        "form": { "name_label": "Name", "name_placeholder": "Full name", "phone_label": "Phone", "phone_placeholder": "+370...", "message_label": "Message", "message_placeholder": "Car make, model, location", "submit": "Send inquiry", "success": "Inquiry received. A response will be provided as soon as possible." }
      },
      "footer": { "copy": "© 2026 checkauto.lt. All rights reserved.", "credit": "Website created by" }
    }
  };

  /**
   * Resolve a dot-notation key against a nested object.
   */
  function resolve(obj, path) {
    return path.split('.').reduce((acc, part) => {
      return acc && acc[part] !== undefined ? acc[part] : null;
    }, obj);
  }

  /**
   * Apply translations to all elements with [data-i18n] on the page.
   * Skips elements that have child elements (to preserve inner HTML like <span>).
   */
  function applyTranslations(data) {
    if (!data) return;

    // Standard text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = resolve(data, key);
      if (value !== null) {
        // Only set textContent if element has no child elements to preserve
        if (el.children.length === 0) {
          el.textContent = value;
        } else {
          // Preserve child elements - only update text nodes
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
          const textNodes = [];
          let node;
          while (node = walker.nextNode()) {
            if (node.parentElement === el) textNodes.push(node);
          }
          // For elements with mixed content, just update first/last text nodes
          // This handles cases like "Su check<span>auto</span>.lt"
          if (textNodes.length > 0) {
            const parts = value.split('checkauto');
            if (parts.length === 2 && el.querySelector('.logo-accent')) {
              textNodes[0].textContent = parts[0] + 'check';
              if (textNodes.length > 1) textNodes[textNodes.length - 1].textContent = '.lt';
            }
          }
        }
      }
    });

    // Placeholders for inputs/textareas
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const value = resolve(data, key);
      if (value !== null) el.setAttribute('placeholder', value);
    });

    // Aria labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const value = resolve(data, key);
      if (value !== null) el.setAttribute('aria-label', value);
    });
  }

  /**
   * Update the visual state of language dropdown.
   */
  function updateSwitcherUI(lang) {
    document.querySelectorAll('.lang-dropdown').forEach(dropdown => {
      dropdown.setAttribute('data-active-lang', lang);
      dropdown.querySelectorAll('.lang-dropdown-menu li').forEach(li => {
        li.classList.toggle('active', li.getAttribute('data-lang') === lang);
      });
    });
  }

  /**
   * Set the active language, persist to localStorage, and re-render all text.
   */
  function setLanguage(lang) {
    const data = translations[lang];
    if (!data) return;
    applyTranslations(data);
    updateSwitcherUI(lang);
    localStorage.setItem('checkauto-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    // Remove loading class to reveal page after translations are applied
    document.documentElement.classList.remove('i18n-loading');
  }

  /**
   * Initialize the i18n system.
   */
  function init() {
    const savedLang = localStorage.getItem('checkauto-lang') || DEFAULT_LANG;
    document.documentElement.setAttribute('lang', savedLang);
    setLanguage(savedLang);

    // Bind language dropdown
    document.querySelectorAll('.lang-dropdown').forEach(dropdown => {
      const toggle = dropdown.querySelector('.lang-dropdown-toggle');
      const menu = dropdown.querySelector('.lang-dropdown-menu');

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close other dropdowns
        document.querySelectorAll('.lang-dropdown.open').forEach(d => {
          if (d !== dropdown) {
            d.classList.remove('open');
            d.querySelector('.lang-dropdown-toggle').setAttribute('aria-expanded', 'false');
          }
        });
        dropdown.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(dropdown.classList.contains('open')));
      });

      menu.querySelectorAll('li[data-lang]').forEach(li => {
        li.addEventListener('click', () => {
          const lang = li.getAttribute('data-lang');
          if (lang) setLanguage(lang);
          dropdown.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    });

    // Close dropdown on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.lang-dropdown.open').forEach(d => {
        d.classList.remove('open');
        d.querySelector('.lang-dropdown-toggle').setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.checkautoI18n = { setLanguage };
})();
