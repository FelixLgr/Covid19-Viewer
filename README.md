# Projet WIM4.1
`Maxime Pierront & Félix Legrelle`

_[Lien vers le site](http://dwarves.iut-fbleau.fr/~legrelle/covid19/)_

## But

Écrire une application web en javascript qui permet de consulter
des données relatives à la pandémie du covid 19.


- La partie cliente devra être réaliser au moyen du framework [riotjs](https://riot.js.org/).
- Les données seront récupérées au moyen de [l'api covid19api](https://covid19api.com/). 

## Fonctionnalités 

- L'application permet de visualiser les données (du jour et en cumulé depuis le début de la pandémie) 
  du nombre de cas déclarés, morts et guéris de la maladie, par pays, sous forme d'une table. 
  Chaque colonne est triable par ordre croissant/décroissant.

- Chaque pays est un lien qui amène à un graphique représentant l'évolution de la pandémie depuis le début.

- Mise en place d'une carte cliquable pour accéder plus facilement aux differents pays.

## Technologies utilisées

- [Riot.js](https://riot.js.org/) `v4.12.4` 
- [covid19api](https://covid19api.com/) `v0.0.8` 
- [Bootstrap](https://getbootstrap.com/) `v4.5.0` 
- [FontAwesome](https://fontawesome.com/) `v5.13.0` 
- [amcharts](https://www.amcharts.com/) `v4.9.24` 
- [datatables](https://datatables.net/) `v1.10.21` 
- [localStorageDB](https://github.com/knadh/localStorageDB) `v2.3.2`