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

1. Sur le PC, ouvrez l'adresse GitHub Pages → onglet **Réglages** → **Synchronisation**.
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

**Budget**
- Le bouton **+** ajoute une **dépense** ou une **entrée d'argent** (onglet en haut de la fenêtre).
- Une entrée a une **catégorie** (remboursement mutuelle, remboursement d'un proche, vente, prime, cadeau…) pour savoir d'où vient l'argent. Elle peut aussi être **déduite d'une enveloppe** : un remboursement de mutuelle redonne le montant à l'enveloppe Santé, et un ami qui rembourse sa part du resto le redonne à Restaurants. Sans enveloppe, l'argent s'ajoute simplement au reste du cycle (vente, prime…).
- Les catégories d'entrées et leur enveloppe par défaut se règlent dans **Réglages › Catégories d'entrées**.
- Touchez un mouvement pour le modifier ou le supprimer, et une enveloppe pour filtrer la liste (ses dépenses et ses remboursements).
- Le **revenu du cycle** reprend le revenu habituel défini dans les Réglages. Modifiez-le sur un cycle pour une prime, un salaire différent, etc.
- Les enveloppes de type **Épargne** (virements vers l'épargne ou les placements) comptent dans les sorties, mais pas dans le « reste par jour ».
- Les soldes des comptes d'épargne se mettent à jour dans l'onglet Budget. Le nom et l'objectif se règlent dans les Réglages.

**Bilan**
- En haut de l'onglet Budget, basculez de **Cycle** à **Bilan**.
- Choisissez la période : 12 derniers cycles, une année, ou tout l'historique.
- **Dépenses** = sorties hors virements vers l'épargne et les placements. **Épargne** = revenus − dépenses (dont la part virée sur vos livrets et placements).
- Le graphique montre les dépenses de chaque cycle (barre rouge si elles dépassent les revenus) ; touchez une barre pour ouvrir ce cycle.

**Importer un historique (Excel / CSV)**
1. **Réglages** → **Importer un historique** → **Choisir le fichier**.
2. L'appli reconnaît les colonnes (date, catégorie, montant, commentaire) et les feuilles **Dépenses**, **Revenus** et **Transferts**. Tout reste modifiable.
3. Pour chaque catégorie du fichier, choisissez une enveloppe existante, créez-en une du même nom, ou « Ne pas importer ». Les transferts depuis le compte courant deviennent des virements vers l'épargne ou les placements ; les retraits viennent en déduction. Les salaires deviennent le revenu de leur cycle.
4. **Importer**. Les mouvements sont ajoutés sans rien écraser ; ceux déjà présents sont ignorés (importer deux fois le même fichier ne crée pas de doublons).
5. Par défaut, seuls les mouvements **antérieurs** à votre premier mouvement saisi dans l'appli sont importés, pour éviter les doubles saisies. Videz la case « Importer jusqu'au » pour tout importer.
6. En cas d'erreur : **Annuler cet import** retire tout ce que le dernier import a ajouté.

Vos choix de catégories sont mémorisés pour les imports suivants. Les enveloppes sans budget ni mouvement sur un cycle sont masquées dans la vue Cycle.

**Investissements (DEGIRO)**
1. Sur le site DEGIRO : **Portefeuille** → **Exporter** → **CSV**.
2. Pour le montant investi et les plus-values : export des **Transactions** en CSV, sur une période qui part de l'ouverture du compte.
3. Dans l'appli, **Choisir les fichiers** : un aperçu s'affiche, avec la classe de chaque ligne modifiable avant validation.
4. Pour actualiser les valeurs, réimportez l'export Portefeuille. Les lignes sont reconnues par leur ISIN.

**Cours en direct (Google Sheets)**

Les services de cours gratuits ne couvrent que les actions américaines. L'appli passe donc par la fonction `GOOGLEFINANCE` de Google Sheets, gratuite et valable pour toutes les places (New York, Paris, Varsovie, Londres…), avec un différé d'environ 20 minutes.

1. Onglet **Portefeuille** : pour chaque ligne, indiquez la **quantité** (remplie automatiquement par l'import DEGIRO) et le **symbole** Google Finance, au format `PLACE:CODE` :

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

**Sauvegarde**
Réglages → **Exporter** crée un fichier `.json`. Gardez-en une copie de temps en temps, même avec la synchronisation.

## Comment marche la synchronisation

- Il y a un seul document par compte. C'est le **dernier appareil qui enregistre** qui l'emporte : si vous modifiez sur deux appareils en même temps sans réseau, c'est la dernière version envoyée qui reste.
- Hors ligne, l'appli fonctionne normalement et envoie les modifications au retour du réseau.

## Mettre à jour l'appli

1. Dans GitHub : **Add file** → **Upload files** → déposez les fichiers modifiés (versions 1.2 et 1.3 : `index.html`, et `README.md` si vous voulez le guide à jour ; version 1.1 : `index.html`, `sw.js` et `README.md`) → **Commit changes**. GitHub remplace les anciens fichiers du même nom.
2. Attendez une minute, puis dans l'appli : **Réglages** → **Recharger l'appli**. La version affichée en bas des Réglages doit changer.
3. Si vous changez aussi les icônes ou le manifeste, augmentez le numéro `CACHE` en haut de `sw.js` (`finances-v3`, etc.).

Vos données ne sont pas touchées par une mise à jour.

## Historique des versions

- **1.3** : vue Bilan (période, revenus, dépenses, épargne, graphique par cycle, totaux par enveloppe et par catégorie d'entrée) ; import d'historique Excel / CSV (feuilles dépenses, revenus et transferts, catégories → enveloppes, salaires → revenu du cycle, doublons ignorés, annulation).
- **1.2** : entrées d'argent avec catégories (remboursements, ventes, primes…), déductibles d'une enveloppe ; liste « Mouvements » ; détail des entrées dans le résumé du cycle.
- **1.1** : cours en direct (Google Sheets), colonnes Quantité / Symbole / Cours, onglet Conjoncture (OCDE), classes favorisées dans le rééquilibrage, inflation réelle du pays dans le calcul « après inflation ».
- **1.0** : budget par cycle de paie, portefeuille et import DEGIRO, synchronisation Firebase, mode hors ligne.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | L'appli (interface, calculs, import DEGIRO, cours, conjoncture, synchronisation) |
| `manifest.webmanifest` | Nom, icônes et couleurs pour l'installation |
| `sw.js` | Fonctionnement hors ligne |
| `icon-*.png`, `apple-touch-icon.png` | Icônes |
| `firestore.rules` | Règles de sécurité à coller dans Firebase |
