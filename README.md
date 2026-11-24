# Mes Finances

Appli web installable pour gérer un budget par cycle de paie et suivre ses investissements, avec les mêmes données sur le téléphone et le PC.

- **Budget** : cycle de paie (jour de paie réglable, avancé au vendredi si le jour tombe un week-end), enveloppes, dépenses et entrées d'argent, reste par jour, comptes d'épargne et patrimoine.
- **Bilan** : revenus, dépenses et épargne sur 12 cycles, une année ou tout l'historique, avec le détail par enveloppe ; courbe du patrimoine depuis la première donnée et projection à 1–40 ans (3 scénarios, inflation, impôts).
- **Import d'historique** : vos anciennes dépenses depuis Excel ou CSV (export d'une autre appli de budget, tableau personnel, relevé bancaire).
- **Investissements** : journal des opérations (achats, ventes, dividendes, frais) par compte, import des exports DEGIRO et des relevés de courtier, plus-values réalisées et latentes, rééquilibrage à 25 % par classe, apport, historique.
- **Cours en direct** : la valeur de chaque ligne suit le marché (Google Finance via un Google Sheets à vous, différé d'environ 20 minutes), convertie en euros au taux de la BCE.
- **Conjoncture** : régime économique (boom ou récession, inflationniste ou déflationniste) par pays, à partir des derniers chiffres de l'OCDE (PIB et inflation), relié au rééquilibrage.
- **Synchronisation** avec votre propre projet Firebase (gratuit). Sans Firebase, l'appli marche en local sur un seul appareil.
- Fonctionne **hors ligne** une fois installée.

Installation : environ 15 minutes, à faire de préférence depuis un ordinateur.

---

## 1. Mettre l'appli en ligne (GitHub Pages, gratuit)

1. Créez un compte sur <https://github.com>.
2. Bouton **New** (nouveau dépôt) → nom : `finances` → **Public** → **Create repository**.
3. Sur la page du dépôt, cliquez sur **uploading an existing file**, puis glissez **tous les fichiers** de ce dossier (pas le dossier lui-même) → **Commit changes**.
4. **Settings** → **Pages** → *Source* : **Deploy from a branch** → *Branch* : `main` et `/ (root)` → **Save**.
5. Après une ou deux minutes, l'adresse s'affiche en haut de la page Pages, du type `https://VOTRE-PSEUDO.github.io/finances/`.

> Le dépôt est public : le **code** est visible, mais **pas vos données**. Elles restent sur vos appareils et dans votre base Firebase, protégée par votre mot de passe.

## 2. Créer la base Firebase (gratuit)

Les intitulés de la console peuvent varier légèrement.

1. Allez sur <https://console.firebase.google.com> → **Créer un projet** (Google Analytics n'est pas utile).
2. Dans le projet : **Ajouter une application** → icône **Web** `</>` → surnom « Mes Finances » → ne cochez pas Hosting → **Enregistrer**.
   Copiez le bloc qui s'affiche :
   ```js
   const firebaseConfig = {
     apiKey: "…",
     authDomain: "…",
     projectId: "…",
     …
   };
   ```
   Vous pourrez le retrouver plus tard dans ⚙️ **Paramètres du projet** → **Vos applications**.
3. **Authentication** → **Commencer** → onglet **Méthode de connexion** → **Adresse e-mail/Mot de passe** → **Activer** → Enregistrer.
4. **Authentication** → **Paramètres** → **Domaines autorisés** → **Ajouter un domaine** → `VOTRE-PSEUDO.github.io`.
5. **Firestore Database** → **Créer une base de données** → édition *Standard* si on vous la demande → emplacement en Europe (par exemple `europe-west9`, Paris) → **mode production**.
6. Dans Firestore, onglet **Règles** → remplacez le contenu par celui du fichier `firestore.rules` → **Publier**.

## 3. Relier l'appli à Firebase

1. Sur le PC, ouvrez l'adresse GitHub Pages → menu ☰ → **Réglages** → **Synchronisation**.
2. Collez le bloc `firebaseConfig` → **Enregistrer**.
3. Saisissez votre e-mail et un mot de passe → **Créer mon compte**.
4. Sur le téléphone, ouvrez la même adresse, collez la même configuration, puis **Se connecter** avec le même compte.

Si un appareil contient déjà des données au moment de la première connexion, l'appli demande lesquelles garder : celles en ligne, ou celles de l'appareil.

## 4. Installer l'appli sur le téléphone

- **iPhone (Safari)** : bouton Partager → **Sur l'écran d'accueil**.
- **Android (Chrome)** : menu ⋮ → **Installer l'application** (ou **Ajouter à l'écran d'accueil**).
- **PC (Chrome ou Edge)** : icône d'installation dans la barre d'adresse (facultatif).

## 5. Sécurité renforcée (recommandé)

La configuration Firebase (`apiKey`, etc.) n'est pas un secret : la protection vient des règles Firestore et de votre mot de passe. Pour qu'**aucun autre compte** ne puisse utiliser votre base :

1. Dans l'appli : **Réglages** → **Copier l'identifiant**.
2. Dans Firestore → **Règles**, remplacez la ligne `allow` par la version ci-dessous, avec votre identifiant :
   ```
   allow read, write: if request.auth != null && request.auth.uid == uid && uid == "VOTRE_IDENTIFIANT";
   ```
3. **Publier**.

---

## Utilisation

**Navigation**
- Le bouton **☰** en haut à gauche ouvre le menu : **Accueil** (page de départ), **Bilan**, **Comptes**, **Budget**, **Portefeuille**, **Conjoncture** et **Réglages**. En haut du menu : votre patrimoine suivi ; en bas : l'état et l'heure de la dernière synchronisation.
- **Comptes en direct** : un compte titres, PEA ou crypto peut suivre des **lignes** (symbole, quantité, montant investi), saisies dans sa fiche (**+ Ligne**), arrivées par l'onglet Portefeuille du tableau (colonne Compte) ou créées par un achat du journal. Sa valeur = lignes au cours du moment + **reste du compte** (liquidités et lignes non détaillées). Les virements font bouger le reste, les achats et ventes les lignes et le reste, la bourse les lignes (actualisation toutes les 5 minutes, ou en tirant vers le bas dans Portefeuille). Saisir une valeur totale dans la fiche, ou recevoir un solde par l'onglet Soldes, recale le reste.
- Les symboles des lignes de tous les comptes sont repris dans **Copier les lignes pour Google Sheets** (Réglages › Cours en direct) : recollez-les dans le tableau des cours pour qu'ils aient un cours.
- Pour ouvrir le menu, vous pouvez aussi glisser le doigt depuis le bord gauche de l'écran (sur les pages principales). Pour le fermer : touchez une rubrique, la zone grisée, ou faites-le glisser vers la gauche. Sur un écran large (PC), le menu reste affiché à gauche.
- **Retour en glissant** : sur la page d'une enveloppe ou dans une rubrique des Réglages, glisser le doigt depuis le bord gauche fait suivre la page au doigt et ramène à l'écran précédent (un glissé trop court la remet en place). Le bouton **‹** en haut de ces pages fait de même.
- Sur Android, le bouton Retour revient aussi à l'écran précédent. Sur iPhone, changer de rubrique ne remplit pas l'historique (pas de page en double).
- Couleurs : **vert** pour les revenus, **orange** pour les dépenses, **bleu** pour l'épargne (barres du résumé et du Bilan). Chaque enveloppe a sa propre couleur (logo, jauge, pastille de ses mouvements, graphiques) ; une enveloppe dépassée est hachurée en rouge, avec ⚠.
- Les montants s'affichent dans la police du texte, avec des chiffres de même largeur pour que les colonnes restent alignées.

**Accueil**
- **Résumé** : à gauche, un **anneau** montre la part du budget déjà dépensée ; le point sur l'anneau marque le temps écoulé de la période. Anneau orange quand on dépense plus vite que le temps ne passe, rouge une fois le budget atteint. À droite, le grand chiffre (disponible ou reste) et la ligne jours avant la paie / montant par jour.
- Sur le cycle en cours, deux **pastilles** donnent ce qui reste **aujourd'hui** et **cette semaine** ; touchez-en une pour passer en vue Jour ou Semaine.
- En faisant défiler la page (Accueil et Bilan), une **barre ‹ période ›** reste sous le titre : flèches pour changer de période, toucher le nom pour remonter.
- **Tirer vers le bas** en haut de l'Accueil récupère le tableau Google Sheets (comme ↻ Google Sheets) ; dans Portefeuille, cela actualise les cours.
- **Balayer un mouvement** : vers la gauche pour le **supprimer**, vers la droite pour le **dupliquer** à la date du jour. Un message propose **Annuler** pendant quelques secondes.
- En haut, choisissez la **période** : **Jour**, **Semaine**, **Cycle** (d'une paie à la suivante) ou **Plusieurs** cycles (2, 3, 6 ou 12, ou **Dates…** pour choisir le premier et le dernier jour sur un calendrier), puis ‹ › pour avancer ou reculer. Ce choix est mémorisé sur l'appareil.
- **Jour** : le budget du jour = ce qui reste à dépenser sur le cycle au matin de ce jour ÷ nombre de jours jusqu'à la paie ; le grand chiffre est ce qui reste pour la journée. **Semaine** : même calcul sur 7 jours (lundi → dimanche). Les enveloppes sont ramenées à la période, au prorata des jours du cycle.
- **Plusieurs** : revenus, dépenses et épargne cumulés, budget des enveloppes multiplié par le nombre de cycles. Avec **Dates…** : salaires des paies tombées dans la période, budget des enveloppes au prorata des jours ; ‹ › décale d'une période de même durée.
- Sous le grand chiffre, trois barres : **Revenus** (vert), **Dépenses** (orange, rouge une fois le budget prévu atteint) et **Épargne** (bleu, pleine quand l'objectif est atteint), avec le montant et le prévu (« / 1 000,00 € »). Puis les jours avant la paie / le montant par jour, le compte courant et le revenu du cycle, sans phrases. Le détail des entrées par catégorie se trouve dans le Bilan.
- **Charges** (vue Cycle) : rubrique entre le résumé et les enveloppes, avec une jauge payé / prévu. Touchez-la pour ouvrir la page des charges : en haut, **À passer d'ici la paie**, une case par charge pas encore payée (loyer, abonnements…), dans l'ordre des dates (jour prévu, ou à défaut celui du dernier paiement, affiché « vers le »), avec le total restant. Cochée, la charge devient une dépense datée du jour (montant modifiable avant de valider) : elle quitte la liste et rejoint le détail **semaine par semaine** en dessous. Une charge ne compte dans le disponible qu'une fois cochée. Avec un **jour prévu**, la ligne passe en orange si elle est en retard. Tout repart décoché le jour de la paie. **+ Ajouter une charge** ; touchez le nom d'une charge pour la modifier ou la supprimer ; pour décocher, touchez la dépense dans le détail et supprimez-la. Une dépense de l'enveloppe Charges dont le libellé contient le nom d'une charge la coche aussi (import, tableau de Claude). L'ancienne enveloppe « Paiement régulier » est devenue « Charges » (l'ancien nom reste reconnu) ; son prévu est la somme des charges.
- **Objectifs** (bloc Épargne & placements) : un montant à atteindre pour une date, indépendant des comptes. Cochez les comptes qui l'alimentent, ajoutez si besoin un montant hors comptes ; l'appli affiche la progression et ce qu'il faut mettre de côté par cycle jusqu'à l'échéance.
- **Recherche** (loupe à côté de « Mouvements ») : dans tout l'historique, par libellé, enveloppe, catégorie, compte, montant (42, 42,5) ou date (12/11, nov).
- Les enveloppes d'épargne ont leur propre bloc **Épargne & placements**. Les **mouvements** se classent **par date** ou **par enveloppe** (avec le total de chaque enveloppe).
- **Disponible** (cycle en cours, avec un solde de compte courant) = compte courant − épargne encore à virer ce cycle − charges pas encore passées. C'est ce qui reste vraiment sur le compte courant jusqu'à la paie. Les grosses opérations ponctuelles (vente, remboursement de crédit, argent mis sur un livret) ne jouent que sur le solde du compte courant. Épargner plus que prévu fait baisser le disponible, épargner moins le fait remonter. Sans solde de compte courant, et pour les cycles passés : revenus − dépenses − objectif d'épargne.
- **Par jour** : fixé le jour de la paie (disponible ÷ jours du cycle), puis suivi jour par jour. Dépenser moins un jour ne le fait **pas monter** : la différence est mise de côté et s'affiche en « X d'avance ». Une dépense en trop est prise d'abord sur cette avance, puis fait baisser le montant des jours suivants. Une entrée d'argent (vente, remboursement) le fait monter, sauf si elle est virée sur l'épargne le jour même ou le lendemain. Une épargne en plus de celle prévue est prise sur l'avance, puis fait baisser le montant. Dans la journée, chaque dépense « libre » fait baisser le **reste aujourd'hui** (qui peut passer en négatif) ; les charges cochées et les virements prévus vers l'épargne ne le font pas baisser.
- **Vue Jour** : reste aujourd'hui. **Vue Semaine** : budget = montant par jour du lundi × 7, moins les dépenses libres de la semaine (un jour négatif peut être compensé sur la semaine).
- **Sur le compte courant** : solde estimé du compte courant (voir Comptes), avec la part encore à virer vers l'épargne sur ce cycle.
- Le bouton **+** ouvre la **saisie express** : tapez le montant sur le pavé, puis touchez l'une des 4 enveloppes les plus utilisées (90 derniers jours) : la dépense est enregistrée à la date du jour, avec **Annuler**. **Autre…** ou **Détails** ouvrent le formulaire complet avec le montant déjà rempli ; **Entrée d'argent** et **Virement** aussi. Sur ordinateur, le clavier marche (chiffres, virgule, effacement).
- **Appui long sur +** : formulaire complet, pour une **dépense**, une **entrée d'argent** ou un **virement** (choix en haut de la fenêtre, ou glissez le doigt vers la gauche / la droite). Glissez la fenêtre vers le bas pour la fermer.
- Une **vibration** courte confirme un enregistrement, une charge cochée ou un geste (téléphones Android ; iPhone avec iOS 18 ou plus récent).
- Enveloppes, catégories et comptes s'affichent en grille de logos. **Appui long** sur un logo : les logos bougent, faites-les glisser pour changer l'ordre (enregistré aussitôt, valable partout), puis **Terminé**.
- **Appui long dans les listes** : sur une enveloppe (Accueil) ou un compte (Comptes), la ligne se soulève ; faites-la glisser puis relâchez. Dans Budget et Catégories d'entrées, attrapez la poignée ⠿.
- Saisie : dans Entrée et Virement, **‹ Dépense** / **‹ Entrée** revient à l'onglet précédent (ou glissez vers la droite).
- Logos : plus de 100 logos classés par thème, avec recherche (resto, loyer, livret…). Le logo et la **couleur** d'une enveloppe (logo, jauge, mouvements et graphiques) se changent dans Budget en touchant son logo ; ceux d'une catégorie d'entrée dans Réglages ; ceux d'un compte dans sa fiche (**Plus de logos…**).
- **Virement** : choisissez le compte de départ et d'arrivée. Du compte courant vers un livret ou DEGIRO, c'est de l'épargne du cycle (enveloppe Épargne ou Investissements) ; d'un livret vers le compte courant, de l'épargne reprise ; entre deux comptes d'épargne, seuls les soldes changent.
- **⚠ orange sur le compte courant** : le disponible du cycle dépasse ce qui est vraiment libre sur le compte (mouvement oublié ou solde à mettre à jour).
- Une entrée a une **catégorie** (remboursement mutuelle, remboursement d'un proche, vente, prime, cadeau…) pour savoir d'où vient l'argent. Elle peut aussi être **déduite d'une enveloppe** : un remboursement de mutuelle redonne le montant à l'enveloppe Santé, et un ami qui rembourse sa part du resto le redonne à Restaurants. Sans enveloppe, l'argent s'ajoute simplement au reste du cycle (vente, prime…).
- Les catégories d'entrées et leur enveloppe par défaut se règlent dans **Réglages › Catégories d'entrées**.
- Touchez un mouvement pour le modifier ou le supprimer.
- **Page d'une enveloppe** : touchez une enveloppe (dépenses ou épargne) pour ouvrir sa page, sur la période choisie dans l'Accueil (‹ › pour changer de période) : la jauge (dépensé / prévu / remboursé, reste et reste par jour sur le cycle en cours), le bouton **+ Dépense** (ou **+ Versement** pour l'épargne) avec l'enveloppe déjà choisie, puis le détail **jour par jour** : une barre par jour, le trait pointillé indiquant le rythme prévu, et les mouvements regroupés par jour (total net de chaque jour). Touchez une barre pour aller à ce jour. Au-delà de 62 jours (vue Plusieurs), le détail passe semaine par semaine.
- Le **revenu du cycle** reprend le revenu habituel défini dans **Budget**. Modifiez-le sur un cycle (vue Cycle, case « Revenu du cycle ») pour une prime, un salaire différent, etc.
- Les enveloppes de type **Épargne** (virements vers l'épargne ou les placements) comptent dans les sorties, mais pas dans le « reste par jour ». Mettre plus que prévu y est une bonne nouvelle : la barre reste bleue, avec ✓.
- Une dépense saisie dans une enveloppe **Épargne** propose **Vers le compte** (Livret A, PEL, PEA…) : elle devient un virement depuis le compte courant, comptée dans cette enveloppe, et le solde du compte monte aussitôt. Choisir « Aucun compte suivi » la garde comme dépense d'épargne.

**Budget (montants prévus)**
- Fixez le **revenu habituel** et le montant prévu de chaque enveloppe ; en haut : total prévu, part de dépenses et d'épargne, et ce qui reste **non affecté**.
- Sous chaque enveloppe, la **moyenne** de ce que vous y avez mis sur les 12 derniers cycles terminés (remboursements déduits). **Mettre X €** reprend cette moyenne arrondie à 5 €, **Remplir avec les moyennes** le fait pour toutes les enveloppes.
- Par défaut, les dépenses exceptionnelles (900 € et plus) sont ignorées dans les moyennes, sauf pour l'épargne.
- **Coller un budget** : collez le budget mis au point avec Claude, une enveloppe par ligne (`Courses : 230 €`, liste ou tableau). Les enveloppes reconnues sont mises à jour, les autres sont créées (en type Épargne si le nom l'évoque : livret, PEA, placement…). Les lignes « Total » ou « Salaire » sont ignorées. **Annuler** rétablit le budget d'avant.

**Comptes**
- Comptes **classés par nature** (compte courant, épargne, épargne logement, comptes titres & PEA, trading & crypto, espèces) avec un sous-total par groupe, et un **camembert** de la répartition, par nature ou par compte.
- Touchez un compte pour modifier son solde (et sa date), sa nature, son objectif, sa **couleur** et son **logo**.
- **Compte courant** : recopiez de temps en temps le solde affiché par votre banque, avec sa date. Entre deux mises à jour, l'appli l'estime : solde enregistré + salaires (au jour de paie) et entrées − dépenses et virements saisis depuis. Une dépense oubliée crée un écart, corrigé à la mise à jour suivante.
- Le portefeuille DEGIRO (positions + marge libre) apparaît dans les comptes titres. Le patrimoine suivi additionne tout.
- **Virements** (en bas de la page) : tous les virements entre comptes, du plus récent au plus ancien, groupés par mois, y compris les virements d'épargne arrivés par l'import bancaire (« Virement vers Livret A »). Les pastilles filtrent sur un compte : entrées en + , sorties en −, avec le total. Touchez un virement pour le modifier.

**Marge libre DEGIRO**
- Dans Portefeuille, la ligne « Marge libre » indique l'argent posé sur DEGIRO mais pas encore investi. Elle compte dans le patrimoine, pas dans la performance, et le bouton « Répartir ma marge libre » la propose comme apport à répartir.
- Mise à jour par l'import DEGIRO (ligne de liquidités), par une ligne « MARGE LIBRE » dans l'onglet Portefeuille du tableau privé (montant en colonne Montant investi), ou à la main.

**Apparence** : Réglages › Apparence, thème automatique (suit l'appareil), clair ou sombre.

**Bilan**
- Choisissez la période comme sur l'Accueil : **Jour**, **Semaine**, **Cycle** ou **Plusieurs** (3, 6, 12 cycles, **Tout**, ou **Dates…** sur un calendrier), puis ‹ ›.
- **Jour**, **Semaine**, **Cycle** : une barre par période (14 derniers jours, 12 dernières semaines, 12 derniers cycles), la période choisie surlignée ; ‹ › ou toucher une barre change la période choisie. Les chiffres, les enveloppes et les entrées sont ceux de la période choisie ; les moyennes portent sur les périodes du graphique.
- **Plusieurs** : une barre par cycle ; **Dates…** : par jour, par semaine ou par cycle selon la durée.
- Toucher une enveloppe (liste, ou « Détail › » sous la répartition) ou une catégorie d'entrées ouvre son détail sur la même période ; ‹ (ou glisser depuis le bord gauche) ramène au Bilan. Dans Budget, « Détail › » sous chaque enveloppe.
- **Dépenses** = sorties hors virements vers l'épargne et les placements. **Épargne** = revenus − dépenses sur un cycle ou plus ; sur un jour ou une semaine, c'est l'épargne virée. Revenus = salaires des paies tombées dans la période + autres entrées.
- Les moyennes s'écrivent « Moyenne : montant / cycle » (ou / jour).
- **Touchez une barre** : une bulle affiche les montants exacts, avec **Voir ›** qui ouvre ce jour, cette semaine ou ce cycle dans l'Accueil. **Chiffres** affiche les mêmes montants en tableau.
- **Trajectoire** (bas de la page) : le patrimoine (tous les comptes) depuis votre premier mouvement, puis sa projection.
  - **Passé** : patrimoine d'aujourd'hui moins ce que le budget a ajouté depuis chaque date (salaires + entrées − dépenses ; virements et épargne ne changent rien) et moins les gains du portefeuille (historique des valeurs).
  - **Prévu** (pointillés) : où vous devriez être d'après l'épargne prévue et le scénario médian, depuis le départ. « Prévu à ce jour » donne l'avance ou le retard.
  - **Projection** : chaque mois, chaque famille (livrets réglementés, livrets bancaires, épargne logement, PEA, compte-titres, assurance vie, crypto) rapporte son rendement et reçoit sa part de l'épargne. Ligne = scénario médian, zone = prudent → optimiste.
  - **Impôts** : déduits chaque année pour les livrets et le PEL ; sur les gains, à la sortie, pour PEA, compte-titres, assurance vie et crypto. Les montants sont nets.
  - **€ courants / € d'aujourd'hui** : bascule pour retirer l'inflation (passé réévalué, futur ramené au pouvoir d'achat d'aujourd'hui). Curseur : horizon de 1 à 40 ans.
  - **Hypothèses** : épargne par mois (prévue, réelle = médiane des 6 derniers cycles, ou autre), inflation, et pour chaque famille : part de l'épargne (d'après vos virements des 6 derniers cycles, modifiable), rendements prudent / médian / optimiste, impôt. Valeurs par défaut au 24/11/2026 : Livret A et LDDS 1,7 %, PEL 2 % brut (ouvert en 2026), flat tax 31,4 %, PEA après 5 ans 18,6 %, PEL et assurance vie 17,2 %, inflation 2 % par an (long terme ; l'Insee mesurait 3,4 % sur un an en octobre 2026), actions 2 / 5 / 8 %. Ce sont des repères, pas des prévisions.

**Importer un historique (Excel / CSV)**
1. **Réglages** → **Importer un historique** → **Choisir le fichier**.
2. L'appli reconnaît les colonnes (date, catégorie, montant, commentaire) et les feuilles **Dépenses**, **Revenus** et **Transferts**. Tout reste modifiable.
3. Pour chaque catégorie du fichier, choisissez une enveloppe existante, créez-en une du même nom, ou « Ne pas importer ». Les transferts depuis le compte courant deviennent des virements vers l'épargne ou les placements ; les retraits viennent en déduction. Les salaires deviennent le revenu de leur cycle.
4. **Importer**. Les mouvements sont ajoutés sans rien écraser ; ceux déjà présents sont ignorés (importer deux fois le même fichier ne crée pas de doublons).
5. Par défaut, seuls les mouvements **antérieurs** à votre premier mouvement saisi dans l'appli sont importés, pour éviter les doubles saisies. Videz la case « Importer jusqu'au » pour tout importer.
6. En cas d'erreur : **Annuler cet import** retire tout ce que le dernier import a ajouté.

Vos choix de catégories sont mémorisés pour les imports suivants. Les enveloppes sans budget ni mouvement sur un cycle sont masquées dans l'Accueil.

**Investissements (DEGIRO)**
1. Sur le site DEGIRO : **Portefeuille** → **Exporter** → **CSV**.
2. Pour le montant investi et les plus-values : export des **Transactions** en CSV, sur une période qui part de l'ouverture du compte.
3. Dans l'appli, **Choisir les fichiers** : un aperçu s'affiche, avec la classe de chaque ligne modifiable avant validation.
4. Pour actualiser les valeurs, réimportez l'export Portefeuille. Les lignes sont reconnues par leur ISIN.
5. L'export Transactions alimente aussi le **journal des opérations** (aperçu dans **Opérations**, ajouté à la validation).

**Journal des opérations (Portefeuille › Opérations)**
- Une opération : date, compte (DEGIRO = les lignes du portefeuille ; PEA, Trade Republic, Kraken… = vos comptes titres et crypto), type (Achat, Vente, Dividende, Intérêts, Frais, Versement, Retrait), titre, symbole, ISIN, quantité, prix, montant, frais.
- **Mise à jour automatique** : une opération plus récente que le dernier état connu d'une ligne (import, onglet Portefeuille, quantité corrigée à la main) met à jour la ligne : achat = quantité et prix de revient en plus (nouvelle ligne si le titre est nouveau), vente = quantité en moins et sa part du coût. Pour DEGIRO, la marge libre suit (achat −, vente +, dividende +, frais −). Pour les autres comptes, les achats et ventes mettent à jour les **lignes du compte** et son reste ; dividendes, intérêts et frais changent le reste. Les versements et retraits passent déjà par les virements.
- Une opération plus ancienne que cet état ne change rien : elle sert à l'historique et aux calculs (plus-values réalisées, dividendes).
- **Plus-values réalisées** : prix de revient moyen pondéré, frais d'achat compris ; la vente retire sa part du coût. Chiffres : plus-values réalisées, dividendes et intérêts, frais, montant versé, depuis le début et sur l'année.
- **Positions** des autres comptes d'après le journal : quantité, prix de revient (PRU), valeur au cours en direct si le symbole est dans le tableau des cours, plus-value latente.
- **Importer un relevé** : choisissez le compte puis un CSV ou Excel du courtier. Colonnes reconnues par leur titre (date, type ou description, titre, ISIN, symbole, quantité, cours, montant ou total, frais, devise). Aperçu avant ajout ; une opération déjà présente est ignorée.
- Modifier ou supprimer une opération annule d'abord son effet sur la ligne, la marge libre ou le solde.

**Cours en direct (Google Sheets)**

Les services de cours gratuits ne couvrent que les actions américaines. L'appli passe donc par la fonction `GOOGLEFINANCE` de Google Sheets, gratuite et valable pour toutes les places (New York, Paris, Varsovie, Londres…), avec un différé d'environ 20 minutes.

1. Rubrique **Portefeuille** : pour chaque ligne, indiquez la **quantité** (remplie automatiquement par l'import DEGIRO) et le **symbole** Google Finance, au format `PLACE:CODE` :

   | Exemple | Symbole |
   |---|---|
   | Apple (Nasdaq) | `NASDAQ:AAPL` |
   | LVMH (Paris) | `EPA:MC` |
   | Siemens (Francfort Xetra) | `ETR:SIE` |
   | PKO BP (Varsovie) | `WSE:PKO` |

   Pour trouver un symbole, cherchez la valeur sur <https://www.google.com/finance> : il s'affiche à côté du nom (par exemple `MC · EPA`, à écrire `EPA:MC`).
2. **Réglages** → **Cours en direct** → **Copier les lignes pour Google Sheets**.
3. Ouvrez un nouveau tableau (<https://sheets.new>), cliquez sur la case **A1** et collez. La colonne « Cours » se remplit toute seule.
4. Dans Google Sheets : **Fichier** → **Partager** → **Publier sur le Web** → choisissez la feuille et le format **Valeurs séparées par des virgules (.csv)** → **Publier**. Copiez le lien.
5. Dans l'appli, collez ce lien dans **Lien du tableau publié**.

Les cours s'actualisent à l'ouverture de l'appli, puis toutes les 5 minutes tant qu'elle est ouverte (bouton **Actualiser** dans Portefeuille). Une ligne passe « en direct » quand elle a une quantité et un cours ; sinon, elle garde sa valeur saisie ou importée.

- **Nouvelle valeur plus tard** : indiquez son symbole, recopiez les lignes et recollez-les en A1 du même tableau. Le lien publié ne change pas.
- La colonne **Devise** est devinée d'après la place (`NASDAQ` donne USD, `EPA` EUR, `WSE` PLN, `LON` pence…). Corrigez-la dans le tableau si besoin.
- Si une case affiche `#N/A` dans le tableau, le symbole n'est pas reconnu par Google Finance.
- Lors des imports DEGIRO suivants, le symbole est retrouvé automatiquement grâce à l'ISIN présent dans le tableau.

**Conjoncture (OCDE)**
- Le PIB réel (variation sur un trimestre) et l'inflation (sur un an) de 10 pays sont lus directement auprès de l'OCDE, une fois par jour ou avec le bouton **Actualiser**.
- **Tendance** compare au chiffre précédent (accélération ou ralentissement) ; **Absolu** regarde si la croissance ou l'inflation sont positives.
- Le pays choisi sert aussi au rééquilibrage (classes historiquement favorisées) et au calcul « après inflation » du portefeuille. C'est un repère, pas un conseil en investissement.
- Les données publiées ont souvent 1 à 3 mois de décalage avec l'actualité.

**Google Sheets privé (rempli par Claude)**

Un tableau de votre Google Drive, avec cinq onglets, que Claude remplit à partir de vos captures (relevé bancaire, ticket, confirmation DEGIRO, Trade Republic…) :

| Onglet | Colonnes | Effet dans l'appli |
|---|---|---|
| Mouvements | ID, Date, Type (Dépense / Entrée / Virement), Montant, Enveloppe, Catégorie (entrées), Libellé, De, Vers (virements) | Ajout des mouvements, sans doublons grâce à l'ID. Un virement (ou une dépense « Virement vers Livret A ») devient un vrai virement : le solde du compte d'arrivée suit, sauf s'il a été relevé après.. Une ligne corrigée dans le tableau est corrigée dans l'appli ; une modification faite dans l'appli est gardée. |
| Budget | Enveloppe, Prévu, Type (Dépense / Épargne) | Montants prévus. La première fois, l'appli demande votre accord ; ensuite, chaque changement du tableau s'applique avec « Annuler ». |
| Portefeuille | Symbole, Quantité, Montant investi, Classe, ISIN, Nom, Compte (facultatif) | Sans compte (ou DEGIRO) : quantités et coût des lignes DEGIRO du même symbole ou ISIN ; une valeur absente est ajoutée dans la classe indiquée. Avec un compte (PEA, Trade Republic…) : les lignes de ce compte, remplacées en bloc ; une ligne « LIQUIDITES » donne son reste. |
| Soldes | Compte, Solde, Date, Couleur, Icône, Remarque, Nature | « Compte courant » (ou CCP) met à jour le solde réel du compte courant ; « Degiro », la couleur du portefeuille ; les autres lignes, les comptes du même nom (créés s'ils manquent), avec leur nature, couleur et logo. Un solde plus ancien que celui saisi dans l'appli est ignoré. |
| Transactions | ID, Date, Compte (DEGIRO, PEA, Trade Republic…), Type (Achat / Vente / Dividende / Intérêts / Frais / Versement / Retrait), Nom, Symbole, ISIN, Quantité, Prix, Montant (€), Frais (€) | Ajout au journal des opérations, sans doublons grâce à l'ID ; une opération plus récente que l'état du portefeuille met la ligne à jour. Avec cet onglet, ne pas modifier aussi la quantité dans l'onglet Portefeuille (l'appli s'en charge). Dividende : montant net, négatif pour une retenue d'impôt. |

L'appli lit ces cinq onglets avec votre compte Google et n'y écrit jamais. Le tableau n'est pas publié et reste visible par vous seul. Les cours, eux, viennent toujours du tableau « Cours en direct ».

*Copie des données de l'appli (pour que Claude voie vos saisies)*

L'appli recopie aussi ses propres données dans six onglets qu'elle crée et réécrit entièrement à chaque envoi :

| Onglet | Contenu |
|---|---|
| Appli · Infos | Date et appareil du dernier envoi, version, cycle en cours, jour de paie, revenu habituel |
| Appli · Mouvements | Tous les mouvements (dépenses, entrées, virements), du plus récent au plus ancien, avec enveloppe, catégorie, comptes, début du cycle et origine (Appli, Tableau (Claude), Import bancaire) |
| Appli · Budget | Budget du cycle en cours : prévu, dépensé, remboursé et reste par enveloppe, puis les totaux |
| Appli · Comptes | Compte courant (estimé), comptes d'épargne avec objectif, marge libre DEGIRO, valeur du portefeuille |
| Appli · Portefeuille | Chaque ligne : quantité, montant investi, valeur, cours, plus-value |
| Appli · Opérations | Journal des opérations (compte, type, titre, quantité, prix, montant, frais, plus-value réalisée, origine), puis les positions des autres comptes |

- L'envoi est automatique quelques secondes après chaque changement, tant que la connexion Google est active (environ une heure après **↻ Google Sheets**).
- Ensuite, un **point orange** sur **↻ Google Sheets** signale des changements pas encore envoyés : touchez-le avant d'écrire à Claude, il récupère et envoie.
- Inutile de modifier ces onglets à la main : ils sont réécrits au prochain envoi.
- À désactiver dans **Réglages** → **Google Sheets privé** → **Copier mes données dans le tableau**.

*Mise en place (une seule fois)*
1. Sur <https://console.cloud.google.com>, choisissez le projet de votre Firebase (menu en haut de la page).
2. **API et services** → **Bibliothèque** → **Google Sheets API** → **Activer**.
3. **Google Auth Platform** (ou **Écran de consentement OAuth**) → **Commencer** : nom de l'appli, votre e-mail, public **Externe** → Créer. Puis **Audience** → **Utilisateurs test** → ajoutez votre adresse Gmail.
4. **Clients** → **Créer un client** → type **Application Web** → **Origines JavaScript autorisées** : l'adresse de l'appli sans le chemin (par exemple `https://votre-nom.github.io`) → **Créer**. Copiez l'**ID client**.
5. Dans l'appli : **Réglages** → **Google Sheets privé** → collez l'ID client et le lien du tableau → **Se connecter et synchroniser**. Choisissez le compte Google qui possède le tableau. Google affiche « Google n'a pas validé cette application » : c'est normal pour une appli personnelle, touchez **Continuer**.

*Au quotidien*
- Le bouton **↻ Google Sheets** (Accueil, en face de « Mouvements ») récupère les nouveautés et envoie vos données. La connexion dure environ une heure ; pendant ce temps, l'appli vérifie aussi toute seule toutes les 5 minutes.
- Une récupération sur un seul appareil suffit : les autres reçoivent les données par la synchronisation Firebase. Si la fenêtre de connexion Google ne s'ouvre pas sur le téléphone, faites-le depuis le PC.
- L'appli n'écrit que dans les onglets « Appli · … », jamais dans ceux que remplit Claude.

**Sauvegarde**
Réglages → **Exporter** crée un fichier `.json`. Gardez-en une copie de temps en temps, même avec la synchronisation.

**Bilan : répartition des dépenses**
- Sur la période choisie, la part de chaque enveloppe de dépenses en **camembert** ou en **barres** : les 7 plus grosses, le reste regroupé dans « Autres ». Touchez une enveloppe pour voir son montant et sa moyenne par cycle.

**Réglages et personnalisation**
- Les Réglages sont une liste de rubriques ; chacune s'ouvre sur sa page (‹ Réglages pour revenir).
- **Réglages › Personnalisation** : ordre des blocs de l'Accueil, ordre du menu, ordre des enveloppes, et blocs ou rubriques à masquer (👁). Rien ne change avant **Enregistrer** ; **Annuler** abandonne, **Réinitialiser** remet l'ordre d'origine (à enregistrer ensuite). Accueil et Réglages restent toujours dans le menu.

## Comment marche la synchronisation

- Il y a un seul document par compte. C'est le **dernier appareil qui enregistre** qui l'emporte : si vous modifiez sur deux appareils en même temps sans réseau, c'est la dernière version envoyée qui reste.
- Hors ligne, l'appli fonctionne normalement et envoie les modifications au retour du réseau.

## Mettre à jour l'appli

1. Dans GitHub : **Add file** → **Upload files** → déposez les fichiers modifiés (versions 1.2 à 1.15 : `index.html`, et `README.md` si vous voulez le guide à jour ; version 1.1 : `index.html`, `sw.js` et `README.md`) → **Commit changes**. GitHub remplace les anciens fichiers du même nom.
2. Attendez une minute, puis dans l'appli : **Réglages** → **Recharger l'appli**. La version affichée en bas des Réglages doit changer.
3. Si vous changez aussi les icônes ou le manifeste, augmentez le numéro `CACHE` en haut de `sw.js` (`finances-v3`, etc.).

Vos données ne sont pas touchées par une mise à jour.

## Historique des versions

- **1.15** : style de la maquette dans toute l'appli (gris chauds, terre cuite pour les dépenses, indigo pour les actions, titres sans majuscules, double anneau dépensé / jours avec « avant paie », pastilles Aujourd'hui / Semaine, enveloppes en carrés pastel avec jauge fine, période dans l'en-tête) ; **comptes en direct** (lignes au cours de bourse pour PEA, Trade Republic, crypto…, mises à jour par les virements, le journal et la bourse) ; épargne saisie = virement vers le compte choisi ; fenêtres qui défilent d'un bloc avec les boutons toujours visibles ; plus de sélection de texte au toucher ; textes inutiles retirés (hypothèses, « relevé du » du compte courant) ; charges à cocher classées par date (jour prévu, sinon celui du dernier paiement).
- **1.14** : nouveau style : chiffres dans la police du texte (chiffres de même largeur), cartes plus douces, boutons et lignes plus grands ; **anneau** dépensé / temps écoulé et **pastilles Aujourd'hui / Semaine** dans l'Accueil ; **barre de période** qui reste en haut en faisant défiler ; **couleur propre à chaque enveloppe** ; **balayer un mouvement** pour le supprimer ou le dupliquer (avec Annuler) ; **tirer pour actualiser** ; **saisie express** (pavé + 4 enveloppes) ; animations légères et vibration.
- **1.13** : **journal des opérations** de placement par compte (saisie, export Transactions DEGIRO, relevés CSV ou Excel des courtiers, onglet « Transactions » du tableau rempli par Claude), qui met à jour les lignes du portefeuille, la marge libre et les soldes, avec plus-values réalisées, dividendes, frais et positions des autres comptes ; onglet « Appli · Opérations » ; **trajectoire du patrimoine** dans le Bilan (passé reconstitué depuis le premier mouvement, « Prévu à ce jour », projection à 1–40 ans en 3 scénarios, inflation, impôts, € courants ou € d'aujourd'hui, hypothèses modifiables).
- **1.12.1** : le **montant par jour ne monte plus** quand on dépense moins que prévu (l'écart est mis de côté, « X d'avance ») ; **historique des virements** entre comptes dans la page Comptes, avec un filtre par compte (virements d'épargne importés compris).
- **1.12** : **disponible et montant par jour calculés à partir du compte courant** (épargne à virer et charges à passer déduites ; montant du jour fixé le matin, reste du jour qui baisse avec les dépenses, semaine = lundi × 7) ; « Disponible » tout court ; virements d'épargne affichés en épargne et, à l'import ou depuis le tableau, créés comme de vrais virements vers le bon compte ; **détail des enveloppes et des catégories d'entrées depuis le Bilan et le Budget**, sur la même période, avec retour à l'écran d'origine ; **Bilan : une barre par période** (14 jours, 12 semaines, 12 cycles) avec la période choisie surlignée ; plus de « gros carré » dans le détail en vue Jour.
- **1.11** : **page d'une enveloppe** en touchant sa jauge (détail jour par jour avec graphique, mouvements regroupés par jour, **+ Dépense** avec l'enveloppe déjà choisie) ; **page des charges** avec les cases **À passer d'ici la paie** et le détail semaine par semaine ; **retour en glissant** depuis le bord gauche sur ces pages et dans les rubriques des Réglages ; « Disponible à dépenser » devient **Disponible** ; la ligne du détail des entrées sous le résumé est retirée.
- **1.10** : rubrique **Charges** à cocher (jauge, détail, date de paiement, montant modifiable, retard en orange, remise à zéro à la paie) ; **objectifs d'épargne datés** ; **recherche** dans les mouvements ; **calendrier** pour choisir ses dates (Accueil › Plusieurs et Bilan) ; Bilan en jour / semaine / cycle / plusieurs ; **appui long** pour réordonner enveloppes, comptes, catégories et charges dans les listes ; retour **‹ Dépense** dans Entrée et Virement ; textes raccourcis partout (séparés par des /, explications derrière **i**) ; correction de la page en double à l'ouverture du menu sur iPhone. Les charges et objectifs sont aussi recopiés dans l'onglet « Appli · Budget ».
- **1.9** : l'appli recopie ses données (mouvements, budget du cycle, comptes, portefeuille) dans des onglets « Appli · … » du Google Sheets privé, pour que Claude voie vos saisies ; envoi automatique tant que la connexion Google est active, point orange quand des changements restent à envoyer. La connexion Google demande désormais l'accès en modification.
- **1.8** : période Jour / Semaine / Cycle / Plusieurs cycles dans l'Accueil (budget du jour), trois barres revenus / dépenses / épargne, bloc Épargne & placements, mouvements par date ou par enveloppe ; répartition des dépenses en camembert ou barres dans le Bilan ; plus de 100 logos avec recherche et couleur par enveloppe ; appui long pour réorganiser les logos ; fenêtre de saisie au glissé (fermer, changer de type) ; Réglages en rubriques avec page Personnalisation ; boutons plus grands.
- **1.7** : saisie en grille de logos, virements entre comptes, comptes classés par nature avec camembert, couleurs et logos des comptes, marge libre DEGIRO, alerte disponible / compte courant, menu au glissé, thème clair / sombre.
- **1.6** : « Disponible à dépenser » (objectif d'épargne déduit) à la place de « Reste sur le cycle » ; solde du compte courant (solde réel + mouvements saisis depuis) dans l'Accueil, les Comptes et le patrimoine ; onglet Soldes dans le Google Sheets privé.
- **1.5** : Google Sheets privé (lecture seule avec votre compte Google) pour les mouvements, le budget et les quantités du portefeuille remplis par Claude.
- **1.4** : menu latéral (patrimoine, rubriques, heure de synchronisation), rubriques Bilan, Comptes et Budget séparées ; page Budget avec moyennes des derniers cycles et budget à coller ; couleurs par type (revenus, dépenses, épargne), épargne au-dessus de l'objectif en bleu ; Bilan en barres groupées avec bulle des montants exacts au toucher ; plus de zoom au double-tap.
- **1.3** : vue Bilan (période, revenus, dépenses, épargne, graphique par cycle, totaux par enveloppe et par catégorie d'entrée) ; import d'historique Excel / CSV (feuilles dépenses, revenus et transferts, catégories → enveloppes, salaires → revenu du cycle, doublons ignorés, annulation).
- **1.2** : entrées d'argent avec catégories (remboursements, ventes, primes…), déductibles d'une enveloppe ; liste « Mouvements » ; détail des entrées dans le résumé du cycle.
- **1.1** : cours en direct (Google Sheets), colonnes Quantité / Symbole / Cours, rubrique Conjoncture (OCDE), classes favorisées dans le rééquilibrage, inflation réelle du pays dans le calcul « après inflation ».
- **1.0** : budget par cycle de paie, portefeuille et import DEGIRO, synchronisation Firebase, mode hors ligne.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | L'appli (interface, calculs, import DEGIRO, cours, conjoncture, synchronisation) |
| `manifest.webmanifest` | Nom, icônes et couleurs pour l'installation |
| `sw.js` | Fonctionnement hors ligne |
| `icon-*.png`, `apple-touch-icon.png` | Icônes |
| `firestore.rules` | Règles de sécurité à coller dans Firebase |
