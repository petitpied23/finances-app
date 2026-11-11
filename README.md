# Mes Finances

Appli web installable pour gérer un budget par cycle de paie et suivre ses investissements, avec les mêmes données sur le téléphone et le PC.

- **Budget** : cycle de paie (jour de paie réglable, avancé au vendredi si le jour tombe un week-end), enveloppes, dépenses et entrées d'argent, reste par jour, comptes d'épargne et patrimoine.
- **Bilan** : revenus, dépenses et épargne sur 12 cycles, une année ou tout l'historique, avec le détail par enveloppe.
- **Import d'historique** : vos anciennes dépenses depuis Excel ou CSV (export d'une autre appli de budget, tableau personnel, relevé bancaire).
- **Investissements** : import des exports DEGIRO, montant investi et plus-values, rééquilibrage à 25 % par classe, apport, historique.
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
- Le bouton **☰** en haut à gauche ouvre le menu : **Accueil** (le cycle de paie en cours), **Bilan**, **Comptes**, **Budget**, **Portefeuille**, **Conjoncture** et **Réglages**. En haut du menu : votre patrimoine suivi ; en bas : l'état et l'heure de la dernière synchronisation.
- Pour ouvrir le menu, vous pouvez aussi glisser le doigt depuis le bord gauche de l'écran. Pour le fermer : touchez une rubrique, la zone grisée, ou faites-le glisser vers la gauche. Sur un écran large (PC), le menu reste affiché à gauche.
- Le bouton Retour du téléphone revient à la rubrique précédente.
- Couleurs : **vert** pour les revenus, **orange** pour les dépenses, **bleu** pour l'épargne. Une enveloppe de dépense dépassée est hachurée en rouge, avec ⚠.

**Accueil (cycle de paie)**
- **Disponible à dépenser** = revenus du cycle (salaire + autres entrées) − dépenses − objectif d'épargne du cycle (total des enveloppes de type Épargne, ou ce qui a déjà été viré si c'est plus). C'est ce que vous pouvez encore dépenser jusqu'à la prochaine paie en tenant votre objectif d'épargne ; l'appli indique aussi le montant par jour. Sur un cycle terminé, le chiffre devient « Restant en fin de cycle ».
- **Sur le compte courant** : solde estimé du compte courant (voir Comptes), avec la part encore à virer vers l'épargne sur ce cycle.
- Le bouton **+** ajoute une **dépense**, une **entrée d'argent** ou un **virement** (choix en haut de la fenêtre). Enveloppes et catégories s'affichent en grille de logos ; le logo d'une enveloppe se change dans Budget (touchez-le), celui d'une catégorie d'entrée dans Réglages.
- **Virement** : choisissez le compte de départ et d'arrivée. Du compte courant vers un livret ou DEGIRO, c'est de l'épargne du cycle (enveloppe Épargne ou Investissements) ; d'un livret vers le compte courant, de l'épargne reprise ; entre deux comptes d'épargne, seuls les soldes changent.
- **Alerte** : si le disponible du cycle dépasse ce qui est vraiment libre sur le compte courant, l'Accueil le signale (mouvement oublié ou solde à mettre à jour).
- Une entrée a une **catégorie** (remboursement mutuelle, remboursement d'un proche, vente, prime, cadeau…) pour savoir d'où vient l'argent. Elle peut aussi être **déduite d'une enveloppe** : un remboursement de mutuelle redonne le montant à l'enveloppe Santé, et un ami qui rembourse sa part du resto le redonne à Restaurants. Sans enveloppe, l'argent s'ajoute simplement au reste du cycle (vente, prime…).
- Les catégories d'entrées et leur enveloppe par défaut se règlent dans **Réglages › Catégories d'entrées**.
- Touchez un mouvement pour le modifier ou le supprimer, et une enveloppe pour filtrer la liste (ses dépenses et ses remboursements).
- Le **revenu du cycle** reprend le revenu habituel défini dans **Budget**. Modifiez-le sur un cycle pour une prime, un salaire différent, etc.
- Les enveloppes de type **Épargne** (virements vers l'épargne ou les placements) comptent dans les sorties, mais pas dans le « reste par jour ». Mettre plus que prévu y est une bonne nouvelle : la barre reste bleue, avec ✓.

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

**Marge libre DEGIRO**
- Dans Portefeuille, la ligne « Marge libre » indique l'argent posé sur DEGIRO mais pas encore investi. Elle compte dans le patrimoine, pas dans la performance, et le bouton « Répartir ma marge libre » la propose comme apport à répartir.
- Mise à jour par l'import DEGIRO (ligne de liquidités), par une ligne « MARGE LIBRE » dans l'onglet Portefeuille du tableau privé (montant en colonne Montant investi), ou à la main.

**Apparence** : Réglages › Apparence, thème automatique (suit l'appareil), clair ou sombre.

**Bilan**
- Choisissez la période : 12 derniers cycles, une année, ou tout l'historique.
- **Dépenses** = sorties hors virements vers l'épargne et les placements. **Épargne** = revenus − dépenses (dont la part virée sur vos livrets et placements).
- Le graphique montre, pour chaque cycle, trois barres : revenus, dépenses et épargne (sous la ligne de zéro si vous avez dépensé plus que gagné).
- **Touchez une barre** : une bulle affiche les montants exacts du cycle, avec **Voir le cycle**. Touchez-la à nouveau, ou ailleurs, pour la fermer. Avec beaucoup de cycles, faites glisser le graphique.
- **Voir les chiffres par cycle** affiche les mêmes montants en tableau.

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

Un tableau de votre Google Drive, avec quatre onglets, que Claude remplit à partir de vos captures (relevé bancaire, ticket, confirmation DEGIRO) :

| Onglet | Colonnes | Effet dans l'appli |
|---|---|---|
| Mouvements | ID, Date, Type (Dépense / Entrée), Montant, Enveloppe, Catégorie (entrées), Libellé | Ajout des mouvements, sans doublons grâce à l'ID. Une ligne corrigée dans le tableau est corrigée dans l'appli ; une modification faite dans l'appli est gardée. |
| Budget | Enveloppe, Prévu, Type (Dépense / Épargne) | Montants prévus. La première fois, l'appli demande votre accord ; ensuite, chaque changement du tableau s'applique avec « Annuler ». |
| Portefeuille | Symbole, Quantité, Montant investi, Classe, ISIN, Nom | Quantités et coût des lignes du même symbole ou ISIN ; une valeur absente est ajoutée dans la classe indiquée. |
| Soldes | Compte, Solde, Date, Couleur, Icône, Remarque, Nature | « Compte courant » (ou CCP) met à jour le solde réel du compte courant ; « Degiro », la couleur du portefeuille ; les autres lignes, les comptes du même nom (créés s'ils manquent), avec leur nature, couleur et logo. Un solde plus ancien que celui saisi dans l'appli est ignoré. |

L'appli lit le tableau avec votre compte Google, en **lecture seule**. Il n'est pas publié et reste visible par vous seul. Les cours, eux, viennent toujours du tableau « Cours en direct ».

*Mise en place (une seule fois)*
1. Sur <https://console.cloud.google.com>, choisissez le projet de votre Firebase (menu en haut de la page).
2. **API et services** → **Bibliothèque** → **Google Sheets API** → **Activer**.
3. **Google Auth Platform** (ou **Écran de consentement OAuth**) → **Commencer** : nom de l'appli, votre e-mail, public **Externe** → Créer. Puis **Audience** → **Utilisateurs test** → ajoutez votre adresse Gmail.
4. **Clients** → **Créer un client** → type **Application Web** → **Origines JavaScript autorisées** : l'adresse de l'appli sans le chemin (par exemple `https://votre-nom.github.io`) → **Créer**. Copiez l'**ID client**.
5. Dans l'appli : **Réglages** → **Google Sheets privé** → collez l'ID client et le lien du tableau → **Se connecter et récupérer**. Choisissez le compte Google qui possède le tableau. Google affiche « Google n'a pas validé cette application » : c'est normal pour une appli personnelle, touchez **Continuer**.

*Au quotidien*
- Le bouton **↻ Google Sheets** (Accueil, en face de « Mouvements ») récupère les nouveautés. La connexion dure environ une heure ; pendant ce temps, l'appli vérifie aussi toute seule toutes les 5 minutes.
- Une récupération sur un seul appareil suffit : les autres reçoivent les données par la synchronisation Firebase. Si la fenêtre de connexion Google ne s'ouvre pas sur le téléphone, faites-le depuis le PC.
- Rien n'est jamais écrit dans le tableau par l'appli.

**Sauvegarde**
Réglages → **Exporter** crée un fichier `.json`. Gardez-en une copie de temps en temps, même avec la synchronisation.

## Comment marche la synchronisation

- Il y a un seul document par compte. C'est le **dernier appareil qui enregistre** qui l'emporte : si vous modifiez sur deux appareils en même temps sans réseau, c'est la dernière version envoyée qui reste.
- Hors ligne, l'appli fonctionne normalement et envoie les modifications au retour du réseau.

## Mettre à jour l'appli

1. Dans GitHub : **Add file** → **Upload files** → déposez les fichiers modifiés (versions 1.2 à 1.7 : `index.html`, et `README.md` si vous voulez le guide à jour ; version 1.1 : `index.html`, `sw.js` et `README.md`) → **Commit changes**. GitHub remplace les anciens fichiers du même nom.
2. Attendez une minute, puis dans l'appli : **Réglages** → **Recharger l'appli**. La version affichée en bas des Réglages doit changer.
3. Si vous changez aussi les icônes ou le manifeste, augmentez le numéro `CACHE` en haut de `sw.js` (`finances-v3`, etc.).

Vos données ne sont pas touchées par une mise à jour.

## Historique des versions

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
