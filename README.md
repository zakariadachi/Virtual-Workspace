# WorkSphere - Virtual Workspace Manager

## Description

**WorkSphere** est une application web interactive conçue pour gérer les employés d'une entreprise et les affecter à différentes zones de travail (Bureaux, Salle serveur, Réception, etc.) en fonction de leur rôle.

Le projet utilise une carte virtuelle des locaux pour faciliter la visualisation et l'organisation des équipes.

## Fonctionnalités Principales

- **Gestion des Employés :** Ajouter de nouveaux employés avec leurs détails (Photo, Nom, Email, Rôle, Expériences).
- **Carte Interactive :** Visualisation graphique des différentes zones du bureau (Réception, Salle de conférence, Salle serveur, Sécurité, etc.).
- **Affectation par Rôle :** Système intelligent qui filtre les employés selon la zone sélectionnée(ex: Seuls les "Techniciens IT" peuvent être ajoutés à la "Salle des serveurs").
- **Indicateurs Visuels :** Les zones vides ou sans personnel sont mises en évidence (bordure rouge).
- **Persistance des Données :** Utilisation du **LocalStorage** pour sauvegarder les employés et les modifications même après l'actualisation de la page.
- **Responsive Design :** Interface adaptée aux ordinateurs et tablettes.

## Technologies Utilisées

- **HTML5** - Structure de la page.
- **CSS3 & Tailwind CSS** - Mise en page et style (Responsive).
- **JavaScript (Vanilla)** - Logique de l'application (DOM manipulation, LocalStorage, Filtrage).
- **JSON** - Données initiales des employés.

## Comment Lancer le Projet

1.  Clonez ce dépôt ou téléchargez les fichiers.
2.  Assurez-vous que le fichier `data.json` est dans le même dossier.
3.  Ouvrez le fichier `index.html` dans votre navigateur web.

## Structure du Projet

- `index.html` : Interface principale.
- `style.css` : Styles personnalisés et mise en page de la carte.
- `workspace.js` : Scripts pour la gestion des événements et la logique métier.
- `data.json` : Base de données initiale des employés.

---

_Développé pour simplifier la gestion des espaces de travail._
